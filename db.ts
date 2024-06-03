import { file_to_array, timer_start, timer_stop } from "./load_file";

const words = await file_to_array("words_big.txt");
const words2 = await file_to_array("words.txt");

const start = timer_start();

let count = 0;
for (const word of words) {
    if (word.startsWith('P')) {
        const isFound = words2.find(w => w === word);
        if (isFound) {
            count++;
        }
    }
}

const end = timer_stop(start);
console.log(`Time: ${end}ms`);