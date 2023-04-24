 function copyText(element) {
    navigator.clipboard.writeText(element.parentElement.querySelector('.code').innerHTML);
}

addEventListener("DOMContentLoaded", (event) => {
    const codeblocks = document.querySelectorAll('pre');

    let colours = {"red": ["abstract", "assert", "class", "const", "extends", "false", "final",
						"implements", "import", "instanceof", "interface", "native", "new", "null", "package",
						"private", "protected", "public", "return", "static", "strictfp", "super", "synchronized",
						"System", "this", "throw", "throws", "transient", "true", "volatile"],
				   "green": ["break", "case", "catch", "continue", "default", "do", "else",
"finally", "for", "goto", "if", "switch", "try", "while"],
				   "blue": ["boolean", "byte", "char", "double", "enum", "float", "int",
"long", "short", "String", "void"]
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