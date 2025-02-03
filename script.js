import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

// Define coordinates for each letter (ABDO on left, ELMORSI on right)
// Adjusted coordinates to center the text
const letters = {
    "A": [
        [1, 2], [1, 3], [1, 4], [1, 5],  // Left vertical
        [5, 2], [5, 3], [5, 4], [5, 5],  // Right vertical
        [2, 1], [3, 1], [4, 1],          // Top horizontal
        [3, 3], [4, 3]                   // Middle horizontal
    ],
    "B": [
        [7, 1], [7, 2], [7, 3], [7, 4], [7, 5],  // Left vertical
        [8, 1], [9, 1], [10, 2], [9, 3], [10, 4], [9, 5], [8, 5] // Right & curves
    ],
    "D": [
        [12, 1], [12, 2], [12, 3], [12, 4], [12, 5], // Left vertical
        [13, 1], [14, 2], [15, 3], [14, 4], [13, 5]  // Curved right side
    ],
    "O": [
        [17, 2], [17, 3], [17, 4], [17, 5], // Left vertical
        [21, 2], [21, 3], [21, 4], [21, 5], // Right vertical
        [18, 1], [19, 1], [20, 1],         // Top horizontal
        [18, 6], [19, 6], [20, 6]          // Bottom horizontal
    ],
    "E": [
        [26, 1], [26, 2], [26, 3], [26, 4], [26, 5], // Left vertical
        [27, 1], [28, 1], [29, 1],                // Top horizontal
        [27, 3], [28, 3], [29, 3],                // Middle horizontal
        [27, 5], [28, 5], [29, 5]                 // Bottom horizontal
    ],
    "L": [
        [31, 1], [31, 2], [31, 3], [31, 4], [31, 5], // Left vertical
        [32, 5], [33, 5], [34, 5]                 // Bottom horizontal
    ],
    "M": [
        [36, 1], [36, 2], [36, 3], [36, 4], [36, 5], // Left vertical
        [40, 1], [40, 2], [40, 3], [40, 4], [40, 5], // Right vertical
        [37, 2], [38, 3], [39, 2]                     // Middle connections
    ],
    "R": [
        [42, 1], [42, 2], [42, 3], [42, 4], [42, 5], // Left vertical
        [43, 1], [44, 1], [45, 2], [44, 3], [43, 3], // Top and mid curve
        [44, 4], [45, 5]                            // Leg of R
    ],
    "S": [
        [47, 1], [48, 1], [49, 1],       // Top horizontal
        [47, 2],                         // Left vertical
        [47, 3], [48, 3], [49, 3],       // Middle horizontal
        [49, 4],                         // Right vertical
        [47, 5], [48, 5], [49, 5]        // Bottom horizontal
    ],
    "I": [
        [51, 1], [51, 2], [51, 3], [51, 4], [51, 5]  // Vertical bar
    ]
};

// Flatten all points
const points = [
    ...letters["A"], ...letters["B"], ...letters["D"], ...letters["O"],  // ABDO (early weeks)
    ...letters["E"], ...letters["L"], ...letters["M"], 
    ...letters["O"], ...letters["R"], ...letters["S"], ...letters["I"]  // ELMORSI (later weeks)
];

// Function to generate a commit date starting from 3 years ago
const getCommitDate = (x, y) => {
    return moment()
        // .subtract(2, "y") // Go back 3 years
        .startOf('year')  // Start from the beginning of the year
        .add(x, "w")      // Move across weeks
        .add(y, "d")      // Move within week
        .format();
};

// Function to make a commit
const makeCommit = async (x, y) => {
    try {
        const date = getCommitDate(x, y);
        await jsonfile.writeFile(path, { date });

        await git.add([path]);
        await git.commit(date, { "--date": date });
    } catch (err) {
        console.error("Error in committing:", err);
    }
};

// Recursive function to commit letters
const commitLetters = async (index = 0) => {
    if (index >= points.length) {
        console.log("Pushing to remote...");
        return git.push();
    }

    const [x, y] = points[index];
    await makeCommit(x, y);
    commitLetters(index + 1);
};

// Start committing
commitLetters();