import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

// Define coordinates for each letter (ABDO on left, ELMORSI on right)
// Adjusted y-coordinates by adding 1
const letters = {
    "A": [
        [1, 3], [1, 4], [1, 5], [1, 6],  // Left vertical
        [5, 3], [5, 4], [5, 5], [5, 6],  // Right vertical
        [2, 2], [3, 2], [4, 2],          // Top horizontal
        [3, 4], [4, 4]                   // Middle horizontal
    ],
    "B": [
        [7, 2], [7, 3], [7, 4], [7, 5], [7, 6],  // Left vertical
        [8, 2], [9, 2], [10, 3], [9, 4], [10, 5], [9, 6], [8, 6] // Right & curves
    ],
    "D": [
        [12, 2], [12, 3], [12, 4], [12, 5], [12, 6], // Left vertical
        [13, 2], [14, 3], [15, 4], [14, 5], [13, 6]  // Curved right side
    ],
    "O": [
        [17, 3], [17, 4], [17, 5], [17, 6], // Left vertical
        [21, 3], [21, 4], [21, 5], [21, 6], // Right vertical
        [18, 2], [19, 2], [20, 2],         // Top horizontal
        [18, 7], [19, 7], [20, 7]          // Bottom horizontal
    ],
    "E": [
        [26, 2], [26, 3], [26, 4], [26, 5], [26, 6], // Left vertical
        [27, 2], [28, 2], [29, 2],                // Top horizontal
        [27, 4], [28, 4], [29, 4],                // Middle horizontal
        [27, 6], [28, 6], [29, 6]                 // Bottom horizontal
    ],
    "L": [
        [31, 2], [31, 3], [31, 4], [31, 5], [31, 6], // Left vertical
        [32, 6], [33, 6], [34, 6]                 // Bottom horizontal
    ],
    "M": [
        [36, 2], [36, 3], [36, 4], [36, 5], [36, 6], // Left vertical
        [40, 2], [40, 3], [40, 4], [40, 5], [40, 6], // Right vertical
        [37, 3], [38, 4], [39, 3]                     // Middle connections
    ],
    "R": [
        [42, 2], [42, 3], [42, 4], [42, 5], [42, 6], // Left vertical
        [43, 2], [44, 2], [45, 3], [44, 4], [43, 4], // Top and mid curve
        [44, 5], [45, 6]                            // Leg of R
    ],
    "S": [
        [47, 2], [48, 2], [49, 2],       // Top horizontal
        [47, 3],                         // Left vertical
        [47, 4], [48, 4], [49, 4],       // Middle horizontal
        [49, 5],                         // Right vertical
        [47, 6], [48, 6], [49, 6]        // Bottom horizontal
    ],
    "I": [
        [51, 2], [51, 3], [51, 4], [51, 5], [51, 6]  // Vertical bar
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
        .subtract(5, "y") // Go back 3 years
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