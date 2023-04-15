import db from "./db"
import store from "./store"
import cli from "./cli"
import file from "./file"
import open from "./open"
import project from "./project"
import script from "./script"

import migrations from "./laravel/migrations"
import tinker from "./laravel/tinker"

export default {
    ...project,
    ...open,
    ...db,
    ...store,
    ...cli,
    ...file,
    ...script,
    ...migrations,
    ...tinker
}
