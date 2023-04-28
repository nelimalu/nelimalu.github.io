 function copyText(element) {
    navigator.clipboard.writeText(element.parentElement.querySelector('.code').innerHTML);
}

addEventListener("DOMContentLoaded", (event) => {
    const codeblocks = document.querySelectorAll('pre');

    let colours = {"#f6245c": ["abstract", "assert", "class", "const", "extends", "false", "final",
						"implements", "import", "instanceof", "interface", "native", "new", "null", "package",
						"private", "protected", "public", "return", "static", "strictfp", "super", "synchronized",
						"System", "this", "throw", "throws", "transient", "true", "volatile"],
				   "#a5de2a": ["break", "case", "catch", "continue", "default", "do", "else",
"finally", "for", "goto", "if", "switch", "try", "while"],
				   "#a5de2a": ["boolean", "byte", "char", "double", "enum", "float", "int",
"long", "short", "String", "void"],
                    "orange": ["+", "-", "*", "/", "&", "|", "^", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
				  };
    

    codeblocks.forEach(code => {

        let new_code = "";

        for (let line of code.innerHTML.split('\n')) {
        	let new_line = "";
            for (let word of line.split(" ")) {
            	let found = false;
            	for (const [key, value] of Object.entries(colours)) {
            		if (value.includes(word)) {
            			new_line += `<t style="color: ${key};">${word}</t> `;
            			found = true;
            			break;
            		}
            	}

            	if (!found)
            		new_line += word + " ";
            }
            new_code += new_line + "\n";
        }

      code.innerHTML = new_code;
    });


});