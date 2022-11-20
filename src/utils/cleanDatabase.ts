import Database from "../Database";

const cleanDatabase = async () => {
    const db = new Database();
    await db.executeQuery(`DELETE FROM comments`);
    await db.executeQuery(`DELETE FROM files`);
    await db.executeQuery(`DELETE FROM posts`);
    db.close();
}

export default cleanDatabase;