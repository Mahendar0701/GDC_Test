const { log } = require("console");
const fs = require("fs");

const taskFile = "task.txt";
const completedFile = "completed.txt";



const readTaskFile = () => {
    try {
        const data = fs.readFileSync(taskFile, "utf8");
        const lines = data.split("\n");
        const tasks = lines.reduce(function (result, line) {
            const lineSplit = line.split(" ");
            const priorityStr = lineSplit[0];
            const taskArr = lineSplit.slice(1);
            const priority = parseInt(priorityStr, 10);
            const task = taskArr.join(" ").trim();
            if (!isNaN(priority) && task !== "") {
                result.push({ priority, task });
            }
            return result;
        }, []);
        return tasks;
    } catch (err) {
        return [];
    }
};


const saveTasks = (tasks) => {
    //sort tasks
    tasks.sort((a, b) => a.priority - b.priority);
    const lines = tasks.map((task) => `${task.priority} ${task.task}`);
    const data = lines.join("\n");
    fs.writeFileSync(taskFile, data, "utf8");
};

const readCompletedTasks = () => {
    try {
        const data = fs.readFileSync(completedFile, "utf8");
        const lines = data.split("\n");
        const tasks = lines.filter((line) => line.trim() !== "");
        return tasks;
    } catch (err) {
        return [];
    }
};

const saveCompletedTasks = (completedTasks) => {
    const data = completedTasks.join("\n");
    fs.writeFileSync(completedFile, data, "utf8");
};

const addTask = (priority, task) => {

    if ((task) && (priority >= 0)) {
        const tasks = readTaskFile();
        tasks.push({ priority, task });
        saveTasks(tasks);
        console.log(`Added task: "${task}" with priority ${priority}`);
    }
    else if ((priority < 0) && (task)) {
        console.log("Error: Priority should be greater than or equal to zero!")
    }
    else if (!task) {
        console.log("Error: Missing tasks string. Nothing added!");
    }
    else {
        console.log("Error: invalid arguments!");
    }

};

const listTasks = () => {
    const tasks = readTaskFile();
    if (tasks.length === 0) {
        console.log("There are no pending tasks!");
    } else {
        tasks.sort((a, b) => a.priority - b.priority);
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.task} [${task.priority}]`);
        });
    }
};

const deleteTask = (index) => {
    const tasks = readTaskFile();
    if (index >= 1 && index <= tasks.length) {
        tasks.splice(index - 1, 1);
        saveTasks(tasks);
        console.log(`StringContaining "Deleted task #${index}"`);
    }
    else if ((index <= 1) || (index > tasks.length)) {
        console.log(`StringContaining "Error: task with index #${index} does not exist. Nothing deleted."`);

    } else {
        console.log(`StringContaining "Error: Missing NUMBER for deleting tasks.`);
    }
};

const markTaskAsDone = (index) => {
    const tasks = readTaskFile();

    if (index >= 1 && index <= tasks.length) {
        const completedTasks = readCompletedTasks();
        completedTasks.push(tasks[index - 1].task);
        saveCompletedTasks(completedTasks);
        tasks.splice(index - 1, 1);
        saveTasks(tasks);
        console.log("Marked item as done.");
    } else if ((index <= 1) || (index > tasks.length)) {
        console.log(`StringContaining "Error: no incomplete item with index #${index} exists."`);
    } else {
        console.log(`StringContaining "Error: Missing NUMBER for marking tasks as done.`);
    }

};

const generateReport = () => {
    const tasks = readTaskFile();
    const completedTasks = readCompletedTasks();
    console.log(`Pending : ${tasks.length}`);
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.task} [${task.priority}]`);
    });
    console.log("\nCompleted : " + completedTasks.length);
    completedTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task}`);
    });
};

const taskManager = (command, args) => {
    switch (command) {
        case "add":
            const priority = parseInt(args[0], 10);
            const task = args.slice(1).join(" ");
            addTask(priority, task);
            break;
        case "ls":
            listTasks();
            break;
        case "del":
            const index = parseInt(args[0], 10);
            deleteTask(index);
            break;
        case "done":
            const doneIndex = parseInt(args[0], 10);
            markTaskAsDone(doneIndex);
            break;
        case "report":
            generateReport();
            break;
        default:
            console.log(
                `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`
            );
    }
};

const command = process.argv[2];
const args = process.argv.slice(3);

taskManager(command, args);

