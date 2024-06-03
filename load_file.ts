import type { BunFile } from "bun";

export async function file_to_array(filename: string): Promise<string[]> {
    const file = Bun.file(filename);
    return (await file.text()).split('\n');
}

export async function file_to_two_columns(filename: string): Promise<{ first: string, second: string }[]> {
    const file = Bun.file(filename);
    return (await file.text()).split('\n').map(line => {
        const [first, second] = line.split(' ');
        return { first, second };
    });
}

export function word_offset(line_offset: number, word_count: number): { start: number, offset: number} {
    const start = (line_offset - 1) * 6;
    const offset = word_count * 6 - 1;

    return { start, offset };
}

export function word_count(file: BunFile): number {
    return Math.ceil(file.size / 6);
}

export async function get_word(file: BunFile, start: number): Promise<string> {
    const slice = file.slice(start);
    const text = await slice.text();

    const word = text.slice(0, 5);
    return word;
}

export async function search(file: BunFile, target: string): Promise<number> {
    let low = 0;
    let high = word_count(file) - 1;
    let count = 0;

    while (low <= high) {
        count++;
        const mid = Math.floor((low + high) / 2);
        
        const { start, offset } = word_offset(mid, 1);
        const slice = file.slice(start);
        const text = await slice.text();
        const word = text.slice(0, offset);

        if (word === target) {
            if (mid === 0) {
                console.log(`Count: ${count}`);
                return mid;
            }

            const previous_word = await get_word(file, word_offset(mid - 1, 1).start);
            if (mid === 0 || previous_word !== target) {
                console.log(`Count: ${count}`);
                return mid;
            }
            
            high = mid - 1;
        } else if (word < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    console.log(`Count: ${count}`);
    return -1;
}

export function timer_start(): number {
    return performance.now();
}

export function timer_stop(start: number): number {
    return performance.now() - start;
}