
function copy_text(element_id, keep_url) {

    var text = document.getElementById(element_id).innerHTML;
    text = text.replace(/<br>/g, "\n");

    if (keep_url)
        text += "\n" + window.location.href;

    var area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();

    try {
        document.execCommand("copy");
        document.body.removeChild(area);
    }

    catch (err) {
        document.body.removeChild(area);
        console.error("Unable to copy to Clipboard");
    }
}

function copy_text_from_test(test) {
    function align_to_center(text, len=44) {
        if ( text.length >= len ) {
            return text;
        }

        space_size = len - text.length;
        modulo = " ".repeat(space_size % 2);
        space = " ".repeat(space_size / 2);
        return space + text + space + modulo;
    }

    function align_to_right(text, len=13) {
        if ( text.length >= len ) {
            return text;
        }

        space = " ".repeat(len - text.length);
        return space + text;
    }

    function align_to_left(text, len=16) {
        if ( text.length >= len ) {
            return text;
        }

        space = " ".repeat(len - text.length);
        return text + space;
    }

    const pairs = test.options.split(' ');
    hash = "";
    threads = "";

    pairs.forEach(pair => {
        const [key, value] = pair.split('=');

        if(key == "Hash") {
            if(parseInt(value) > 1024) {
                hash = (parseInt(value) / 1024).toFixed(1) + "GB";
                return;
            }
            hash = value + "MB";
            return;
        }

        if(key == "Threads") { 
            threads = value;
        }
    });

    result = "```\n";

    result += align_to_center(test.title) + "\n";
    result += align_to_left("TC: " + test.tc, 15) + "|" + align_to_center("Hash: " + hash, 14) + "|" + align_to_right("Threads: " + threads, 12) + "\n";
    result += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

    switch(test.mode) {
        case 'SPRT': {
            result += "Elo     : " + test.elo + " (95%)\n";
            result += "LLR     : " + test.llr + "\n";
            result += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            wr = (100 * parseInt(test.w) / (parseInt(test.w) + parseInt(test.l))).toFixed(1);
            result += "Games   : " + test.games + " (" + wr + "%)\n";
            result += "W-D-L   : +" + test.w + " =" + test.d + " -" + test.l + "\n";
            result += "Penta   : " + test.penta + "\n";
            break; 
        }
        case 'GAMES': {
            result += "Elo     : " + test.elo + " (95%)\n";
            wr = (100 * parseInt(test.w) / (parseInt(test.w) + parseInt(test.l))).toFixed(1);
            result += "Games   : " + test.games + " / " + test.max_games + " (" + wr + "%)\n";
            result += "W-D-L   : +" + test.w + " =" + test.d + " -" + test.l + "\n";
            result += "Penta   : " + test.penta + "\n";
            break;
        }
    }

    result += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n```";
    result += window.location.origin + test.url;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(result).then(() => {
            console.log("Copied!");
        }).catch(err => console.error(err));
    } else {
        var area = document.createElement("textarea");
        area.value = result;
        document.body.append(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
    }
}