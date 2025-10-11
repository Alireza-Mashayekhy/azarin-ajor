import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals'),

    {
        plugins: {
            'react-hooks': reactHooks,
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'warn',
            'react/jsx-key': [
                'warn',
                {
                    checkFragmentShorthand: true,
                    checkKeyMustBeforeSpread: true,
                    warnOnDuplicates: true
                }
            ],
            'react-hooks/exhaustive-deps': 'warn',
            'react/self-closing-comp': 'warn',
            'prefer-const': 'warn',
            'object-shorthand': 'warn',
            'prefer-destructuring': 'warn',
            'prefer-template': 'warn'
        }
    }
];

export default eslintConfig;
