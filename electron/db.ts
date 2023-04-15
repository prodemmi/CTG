import { Database, OPEN_READWRITE, OPEN_CREATE } from "sqlite3"
import { resolve } from "node:path"

class DatabaseManager {

    db: Database;
    path = resolve(__dirname + '/../../database.db')

    async open() {

        this.db = await new Database(this.path, OPEN_CREATE | OPEN_READWRITE, async (error) => {

            if (error) {

            } else {
                console.log('Connected to the database.');
                this.createTables()
            }

        });

    }

    query(sql: string, bindings: any[] = []) {

        return this.db.run(sql, bindings)

    }

    findAll(table: string, sql?: string){

        return new Promise((resolve, reject) => {

            this.db.all(`SELECT * FROM ${table} ${ sql ?? '' }`, [], (error, rows)=> {

                if(error)
                    reject(error)

                resolve(rows)
            })

        });

    }

    findOne(table: string, id: Number){

        return new Promise((resolve, reject) => {

            this.db.get(`SELECT * FROM ${table} WHERE id = ${id}`, [], (error, rows)=> {

                if(error)
                    reject(error)

                resolve(rows)
            })

        });

    }

    createTables() {
        
        this.query(`CREATE TABLE IF NOT EXISTS projects
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                path TEXT NOT NULL UNIQUE,
                version TEXT NOT NULL,
                type INTEGER NOT NULL,
                folder TEXT
            )
        `)

        this.query(`CREATE TABLE IF NOT EXISTS scripts
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                name TEXT NOT NULL UNIQUE,
                description TEXT,
                command TEXT NOT NULL
            )
        `)
        
    }

    addProject(name: string, path: string, version: string , type: string, folder?: string){

        this.query('INSERT INTO projects (name, path, version, type, folder) VALUES (?, ?, ? , ?, ?)', [name, path, version , type, folder])

    }

    addScript(projectId: Number, name: string, description: string, command: string){

        this.query('INSERT INTO scripts (project_id, name, description, command) VALUES (?, ?, ? , ?)', [projectId, name, description , command])

    }

    deleteProject(projectId: Number){

        this.query(`DELETE FROM projects WHERE id = ${projectId}`)

    }

    deleteScript(scriptId: Number){

        this.query(`DELETE FROM scripts WHERE id = ${scriptId}`)

    }

    close() {
        this.db.close()
    }

}

const DB = new DatabaseManager();
export default DB;