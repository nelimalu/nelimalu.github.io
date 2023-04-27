function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class RigidBody {

    setRestitution(val) {
        this.body.setRestitution(val);
    }

    setFriction(val) {
        this.body.setFriction(val);
    }

    setRollingFriction(val) {
        this.body.setRollingFriction(val);
    }

    createBox(mass, pos, quat, size) {
        this.transform = new Ammo.btTransform();
        this.transform.setIdentity();
        this.transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        this.transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        this.motionState = new Ammo.btDefaultMotionState(this.transform);

        const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
        this.shape = new Ammo.btBoxShape(btSize);
        this.shape.setMargin(0.05);

        this.inertia = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) {
          this.shape.calculateLocalInertia(mass, this.inertia);
        }

        this.info = new Ammo.btRigidBodyConstructionInfo(mass, this.motionState, this.shape, this.inertia);
        this.body = new Ammo.btRigidBody(this.info);

        Ammo.destroy(btSize);
    }

}


class Box {
    constructor(scene, physicsWorld, position, size, mass, materialOptions, options, castShadow=true) {
        this.size = size;
        this.castShadow = castShadow;

        let {map, ...removeMap } = materialOptions
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size.width, size.height, size.length),
            [
              new THREE.MeshPhongMaterial(removeMap),
              new THREE.MeshPhongMaterial(removeMap),
              new THREE.MeshPhongMaterial(removeMap),
              new THREE.MeshPhongMaterial(removeMap),
              new THREE.MeshPhongMaterial(materialOptions),
              new THREE.MeshPhongMaterial(removeMap)
            ]
        );
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = castShadow;
        this.mesh.receiveShadow = true;

        
        if (castShadow) {
            
            this.lights = [];
            for (let i = 0; i < 5; i++) {
                this.lights.push(new THREE.PointLight(0xffffff, 1, 100));
                scene.add(this.lights[i]);
            }

            this.lightPositions = [
                new THREE.Vector3(size.width, 0, 0),
                new THREE.Vector3(-size.width, 0, 0),
                new THREE.Vector3(0, 0, size.length),
                new THREE.Vector3(0, 0, -size.length),
                new THREE.Vector3(0, size.height, 0),
            ];

            this.updateLightPositions();
        } 
        else if (options.randomize)
            this.mesh.quaternion.random();
        

        scene.add(this.mesh);


        this.rigidBody = new RigidBody();
        this.rigidBody.createBox(mass, this.mesh.position, this.mesh.quaternion, new THREE.Vector3(size.width, size.height, size.length));
        this.rigidBody.setRestitution(options.restitution);
        this.rigidBody.setFriction(options.friction);
        this.rigidBody.setRollingFriction(options.rollingFriction);
        physicsWorld.addRigidBody(this.rigidBody.body);

    }

    updateLightPositions() {
        for (let i = 0; i < this.lightPositions.length; i++) {
            this.lights[i].position.set(
                this.mesh.position.x + this.lightPositions[i].x,
                this.mesh.position.y + this.lightPositions[i].y,
                this.mesh.position.z + this.lightPositions[i].z
            );
        }
    }

}

class TextBox extends Box {
    constructor(scene, physicsWorld, position, size, colour, mass, options, castShadow=true) {
        super(scene, physicsWorld, position, size, colour, mass, options, castShadow);
    }
}

class World {
    constructor() {
        this.init();
        this.timeSinceDrop = 0;
    }

    ammoSetup() {
        this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
        this.broadphase = new Ammo.btDbvtBroadphase();
        this.solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration);
        this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
    }

    threeSetup() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, canvas: document.getElementById('background')
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x11151c);
        this.raycaster = new THREE.Raycaster();

        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 1.0;
        const far = 1000.0;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 30, 100);

        this.scene = new THREE.Scene();

        window.addEventListener("mousedown", (event) => {
            let mouse = new THREE.Vector2();
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1,
            mouse.y =  - ( event.clientY / window.innerHeight ) * 2 + 1,
            this.raycaster.setFromCamera( mouse.clone(), this.camera );   

            var objects = this.raycaster.intersectObjects(this.scene.children);
            //console.log(objects);
            
            for (let obj of objects) {
                if (obj.object.name === 'textbox!') {
                    this.clickMeBox(10);
                    break;
                }
            }
            //if (objects.length > 0)
            //    this.clickMeBox(10);
        });
    }

    setup() {
        this.ammoSetup();
        this.threeSetup();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }

    generateBox() {
        const box = new Box(
            this.scene,
            this.physicsWorld,
            {x: randint(20, 60), y: 120, z: randint(0, 20)},
            {length: 4, width: 4, height: 4},
            1,
            {
                color: '#000000',
                emissive: Math.random() > 0.5 ? 0xFFFFFF : 0x000000
            },
            {
                restitution: 0.5,
                friction: 10,
                rollingFriction: 5,
                randomize: true,
            },
            false
        );

        return box;
    }

    generateTextBox(text, colour, textcolour, position, size, lights=true) {
        console.log(size.length);
        var dynamictexture = new THREEx.DynamicTexture(1024, 512);
        
        dynamictexture.context.font = `${size.font}px monospace`;

        dynamictexture.texture.needsUpdate = true;
        dynamictexture.clear('#fff').drawText(text, undefined, 256 + (size.font / 3), textcolour);
        

        const box = new TextBox(
            this.scene,
            this.physicsWorld,
            {x: position.x, y: position.y, z: position.z},
            size,
            1,
            {
                color: colour,
                map: dynamictexture.texture,
            },
            {
                restitution: 0.5,
                friction: 1,
                rollingFriction: 0,
                randomize: false
            },
            lights
        );


        return box;
    }

    clickMeBox(z, lights=false) {
        this.rigidBodies.push(this.generateTextBox(
            "click me!",
            '#eb387d', // box colour
            '#de3333', // text colour
            new THREE.Vector3(lights ? 50 : randint(30, 50), 150, z),
            {length: 20, width: 40, height: 20, font: 150},
            lights
        ));

        this.rigidBodies[this.rigidBodies.length - 1].mesh.name = "textbox!";
    }

    init() {
        this.setup();
        
        const ground = new Box(
            this.scene,
            this.physicsWorld,
            {x: 0, y: 5, z: -30},
            {length: 500, width: 400, height: 1},
            0,
            {
                color: 0x11151c, 
                emissive: 0x11151c,
            },
            {
                restitution: 0.5,
                friction: 5,
                rollingFriction: 0,
                randomize: false
            },
            false
        );

        //const 

        const light1 = new THREE.PointLight(0xffffff, 20, 250);
        light1.position.set(0, 200, 30);
        const light2 = new THREE.PointLight(0xffffff, 1, 300);
        light2.position.set(0, 50, 200);

        this.scene.add(light1);
        this.scene.add(light2);


        //const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        //this.scene.add( light );

        this.rigidBodies = [];
        this.clickMeBox(3, true);
        this.rigidBodies.push(this.generateTextBox(
            "ICS4U0",
            '#50a4d4',
            '#549feb',
            new THREE.Vector3(60, 150, 3),
            {length: 20, width: 40, height: 20, font: 200}
        ));
        
        //for (let i = 0; i < 3; i++) {
        //    this.rigidBodies.push(this.generateBox());
        //}

        this.tempTransform = new Ammo.btTransform();
        this.previousRAF = null;
        this.RAF();
    }

    RAF() {
        requestAnimationFrame((t) => {
            if (this.previousRAF === null) {
                this.previousRAF = t;
            }

            if (t - this.timeSinceDrop > 2000) {
                this.rigidBodies.push(this.generateBox());
                this.timeSinceDrop = t;
            }

            this.step(t - this.previousRAF);
            this.renderer.render(this.scene, this.camera);

            this.RAF();
        });
    }

    step(timeElapsed) {
        this.physicsWorld.stepSimulation(timeElapsed * 0.0001, 5);

        for (let i = 0; i < this.rigidBodies.length; i++) {
            this.rigidBodies[i].rigidBody.motionState.getWorldTransform(this.tempTransform);
            const pos = this.tempTransform.getOrigin();
            const quat = this.tempTransform.getRotation();
            const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
            const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());

            this.rigidBodies[i].mesh.position.copy(pos3);
            this.rigidBodies[i].mesh.quaternion.copy(quat3);
            if (this.rigidBodies[i].castShadow) {
                this.rigidBodies[i].updateLightPositions();
            }
        }
    }
}


var world;

window.addEventListener('DOMContentLoaded', () => {
    Ammo().then((lib) => {
        Ammo = lib;

        
        

        world = new World();
    })
    
});