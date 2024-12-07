import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const path = "./data.json";
const date = moment().subtract(1, 'd').format();
const git = simpleGit();

const pattern = [
   "  ###   ###   #####  ###   ###",
   " ## ## ##### ##     ## ## ## ##",
   "##  # ###### #####  ##  # ##  #",
   "##### ###### #####  ##### ##  ##",
   "##  ## ##### ##     ##  ## ## ##",
   "##  ##  ###   ##### ##  ##  ###"
];

const startDate = moment("2023-06-24", "YYYY-MM-DD");
const endDate = moment("2023-07-22", "YYYY-MM-DD");

const existingCommitDates = [
   "2023-09-05",
   "2023-09-10",
   "2023-09-29",
   "2023-11-23",
   "2023-12-10",
   "2023-12-17"
];

const isDateAvailable = (date) => {
   return (
      !existingCommitDates.includes(date) &&
      moment(date, "YYYY-MM-DD").isBetween(startDate, endDate, null, '[]')
   );
};

const makeRandomCommits = async (numberOfCommits) => {
   for (let i = 0; i < numberOfCommits; i++) {
      const randomDate = moment(startDate).add(Math.floor(Math.random() * (endDate.diff(startDate, 'days') + 1)), 'd').format("YYYY-MM-DD");
      if (isDateAvailable(randomDate)) {
         const data = {
            date: randomDate,
            message: "Random commit!"
         };

         jsonfile.writeFileSync(path, data);
         await git.add(path);
         await git.commit(data.message, { '--date': randomDate });
         console.log(`Random commit for ${randomDate}`);
      } else {
         console.log(`Tanggal ${randomDate} sudah memiliki commit. Lewati.`);
      }
   }
};

const makePatternCommits = async () => {
   for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
         if (pattern[row][col] === '#') {
            const commitDate = startDate.clone().add(row, 'w').add(col, 'd').format("YYYY-MM-DD");
            if (isDateAvailable(commitDate)) {
               const data = {
                  date: commitDate,
                  message: "Look at this"
               };

               jsonfile.writeFileSync(path, data);
               await git.add(path);
               await git.commit(data.message, { '--date': commitDate });
               console.log(`Commit for ${commitDate}`);
            } else {
               console.log(`Tanggal ${commitDate} sudah memiliki commit. Lewati.`);
            }
         }
      }
   }
};

const generateCommits = async () => {
   console.log("Generating pattern...");
   await makePatternCommits();

   console.log("Adding random commit..");
   await makeRandomCommits(20);

   await git.push();
   console.log("All commit push success!");
};

generateCommits().catch(console.error);