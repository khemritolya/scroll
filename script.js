const freq_url = "https://raw.githubusercontent.com/khemritolya/scroll/master/freq.txt";

let freq_table = [];
let bound_size = 0;
let lowest_anchor = "0";
let highest_anchor = "0";

document.addEventListener('DOMContentLoaded', async function() {
    window.location.hash = window.location.hash.replace(/[^#0-9]/g, "");
    window.location.hash = window.location.hash.toLowerCase();

    if (window.location.hash == "" || window.location.hash == "#") {
        window.location.hash = "#0"
    }

    // the raw text representing a frequency table
    let raw;

    // check if we have saved a frequency list
    if (typeof(Storage) !== "undefined" && localStorage.getItem("scroll_freq_table") !== null) {
        console.log("Drawing frequency distribution from local storage!");
        raw = localStorage.getItem("scroll_freq_table");
    } else {
        console.log("Fetching frequency distribution from " + freq_url);

        raw = await (await fetch(freq_url)).text();

        if (typeof(Storage) !== "undefined") {
            try {
                localStorage.setItem("scroll_freq_table", raw)
            } catch(e) {
                console.log("Error saving freq table. Depending on what happened, you may want to submit a bug report.")
            }
        }
    }

    if (raw == "") {
        alert("Something went wrong. Please submit a bug report!");
    }

    const raw_pairs_list = raw.split("\n");
    for (const raw_pair of raw_pairs_list) {
        const [word, raw_freq] = raw_pair.split(" ");
        if (word !== "") {
            const freq = parseInt(raw_freq);
            bound_size += freq;
            freq_table.push([word, freq]);
        }
    }

    console.log("Done building freq table with bound size " + bound_size);
    console.log(freq_table);

    const initial_anchor = window.location.hash.replace("#", "");
    const next_anchor = add(initial_anchor, 1n);
    document.getElementById("body").innerHTML = create_block(initial_anchor) + create_block(next_anchor);
    lowest_anchor = initial_anchor;
    highest_anchor = next_anchor;
});

function add(anchor, value) {
    let asInt = BigInt(anchor) + value;
    return asInt.toString();
}

function random_word(rng) {
    let idx = Math.abs(rng.int32()) % bound_size;

    let arr_index = 0;
    while (idx > freq_table[arr_index][1]) {
        idx -= freq_table[arr_index][1]
        arr_index++;
    }

    return(freq_table[arr_index][0]);
}

function create_block(anchor) {
    if (anchor.startsWith("-")) {
        return("");
    }
    let rng = new Math.seedrandom(anchor);
    let size = 490 + Math.abs(rng.int32()) % 21;
    console.log("Creating a text block with anchor: " + anchor + " of size " + size);

    let res = '';
    for (i = 0; i < size; i++) {
        res += random_word(rng);
        res += " "
    }

    return("<div class = \"box\" id = \"div-" + anchor + "\">" + 
        "<a name=\"" + anchor + "\" href=\"#"+ anchor +"\">Block #" + anchor + "</a>" + 
        "<a href=\"#" + add(anchor, 1n) + "\" class=\"next-link\">next</a>" +
        "<p>" + res + "</p></div>");
}
window.addEventListener('scroll', async function() {
    const element = document.documentElement;
    if (element.scrollTop + 4 * element.clientHeight > element.scrollHeight) {
        let next_anchor = add(highest_anchor, 1n);
        document.getElementById("body").innerHTML += create_block(next_anchor);
        highest_anchor = next_anchor;
    } else if (element.scrollTop === 0 && lowest_anchor !== "0") {
        let prev_anchor = add(lowest_anchor, -1n);
        document.getElementById("html").style.scrollBehavior = "auto";
        document.getElementById("body").innerHTML = create_block(prev_anchor) + document.getElementById("body").innerHTML;
        document.getElementById("div-"+lowest_anchor).scrollIntoView();
        document.getElementById("html").style.scrollBehavior = "smooth";
        lowest_anchor = prev_anchor;
    }
 }, true);