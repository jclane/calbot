const Database = require("better-sqlite3");
const db = new Database("calendar.db", { verbose: console.log });

function createTables() {
  const bdayTable = db.prepare(
    "CREATE TABLE IF NOT EXISTS user_birthdays (userId INTEGER PRIMARY KEY ASC, birthday DATE)"
  );
  bdayTable.run();
  const eventTable = db.prepare(
    "CREATE TABLE IF NOT EXISTS guild_events (eventId INTEGER PRIMARY KEY AUTOINCREMENT, eventName TEXT, eventDate DATE, shortDescription TEXT, longDescription TEXT, attending TEXT)"
  );
  eventTable.run();
}

function insertBirthday(id, bday) {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO user_birthdays (userId, birthday) VALUES (@userId, @birthday)"
  );
  insert.run({ userId: id, birthday: bday });
}

function getBirthday(id) {
  const stmnt = db.prepare(
    "SELECT birthday FROM user_birthdays WHERE (userId = @id)"
  );
  return stmnt.get({ id: id }).birthday;
}

function insertGuildEvent(name, date, shortDesc, longDesc) {
  const insert = db.prepare(
    "INSERT INTO guild_events (eventId, eventName, eventDate, shortDescription, longDescription, attending) VALUES (@name, @date, @shortDesc, @longDesc, '')"
  );
  insert.run({
    name: name,
    date: date,
    shortDesc: shortDesc,
    longDesc: longDesc
  });
}

function getGuildEventByDate(date) {
  const stmnt = db.prepare(
    "SELECT * FROM guild_events WHERE (eventDate = @date)"
  );
  return stmnt.all({ date: date }).eventName;
}

function getTableNames() {
  const stmnt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'");
  let tableNames = stmnt.all();
  console.log(tableNames);
}
