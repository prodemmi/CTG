export * from "./utils"
import laravel from "./laravel"
// import django from "./django"
import no_framework from "./no_framework"
import { Framework } from "../types"

export const frameworks: typeof Framework[] = [
    no_framework,
    laravel,
    // django
]

    // 'lumen',
    // 'phalcon',
    // 'symfony',
    // 'code_igniter',
    // 'cake_php',
    // 'yii',
    // 'flutter',
    // 'react_native',
    // 'ionic',
    // 'xamarin',
    // 'django',
    // 'fast_api',
    // 'backbone',
    // 'flask',
    // 'ruby_on_rails',
    // 'vue',
    // 'svelte',
    // 'nuxt',
    // 'next',
    // 'meteor',
    // 'electron',
    // 'angular',
    // 'asp.net',
    // 'express',
    // 'spring',
    // 'ember',
    // 'gin',
    // 'fast_http',
    // 'echo',
    // 'beego',
    // 'fibre',
    // 'koa',
    // 'nest',
    // 'hapi',
    // 'loopback',
    // 'adonis'