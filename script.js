const freq_url = "https://raw.githubusercontent.com/khemritolya/scroll/master/freq.txt"

let freq_table = []
let bound_size = 0

document.addEventListener('DOMContentLoaded', async function() {
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

    freq_table.reverse();

    console.log("Done building freq table with bound size " + bound_size);
    console.log(freq_table);

    document.getElementById("body").innerHTML = create_block(window.location.hash);
});

function random_word(rng) {
    let idx = Math.abs(rng.int32()) % bound_size;

    let arr_index = 0
    while (idx > 0) {
        idx -= freq_table[arr_index][1]
        arr_index++;
    }

    return(freq_table[arr_index][0]);
}

function create_block(anchor) {
    let rng = new Math.seedrandom(anchor);

    let res = '';
    for (i = 0; i < 1000; i++) {
        res += random_word(rng);
        res += " "
    }

    return("<div class = \"box\"><p>" + res + "</p></div>");
}