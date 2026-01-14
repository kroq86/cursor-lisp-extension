/**
 * Lisp Interpreter implementation
 * Supports basic Lisp operations and custom function definitions
 */

export class LispInterpreter {
    private environment: Map<string, any>;
    private functions: Map<string, Function>;

    constructor() {
        this.environment = new Map();
        this.functions = new Map();
        this.initializeBuiltins();
    }

    private initializeBuiltins() {
        // Arithmetic operations
        this.functions.set('+', (...args: number[]) => 
            args.reduce((a, b) => a + b, 0));
        this.functions.set('-', (a: number, ...args: number[]) => 
            args.reduce((acc, val) => acc - val, a));
        this.functions.set('*', (...args: number[]) => 
            args.reduce((a, b) => a * b, 1));
        this.functions.set('/', (a: number, ...args: number[]) => 
            args.reduce((acc, val) => acc / val, a));
        
        // Comparison
        this.functions.set('=', (a: any, b: any) => a === b);
        this.functions.set('>', (a: number, b: number) => a > b);
        this.functions.set('<', (a: number, b: number) => a < b);
        this.functions.set('>=', (a: number, b: number) => a >= b);
        this.functions.set('<=', (a: number, b: number) => a <= b);
        
        // List operations
        this.functions.set('list', (...args: any[]) => args);
        this.functions.set('car', (list: any[]) => list && list.length > 0 ? list[0] : null);
        this.functions.set('cdr', (list: any[]) => list && list.length > 0 ? list.slice(1) : []);
        this.functions.set('cons', (item: any, list: any[]) => [item, ...list]);
        this.functions.set('length', (list: any[]) => list ? list.length : 0);
        
        // Control flow
        this.functions.set('if', (condition: any, thenExpr: any, elseExpr?: any) => 
            condition ? thenExpr : elseExpr);
        this.functions.set('cond', (...clauses: any[]) => {
            for (const clause of clauses) {
                if (Array.isArray(clause) && clause.length >= 2) {
                    if (clause[0]) {
                        return clause[1];
                    }
                }
            }
            return null;
        });
        
        // Logical operations
        this.functions.set('and', (...args: any[]) => 
            args.every(arg => arg));
        this.functions.set('or', (...args: any[]) => 
            args.some(arg => arg));
        this.functions.set('not', (arg: any) => !arg);
    }

    /**
     * Evaluate a Lisp expression (or multiple expressions)
     */
    evaluate(expression: string): any {
        const tokens = this.tokenize(expression);
        let lastResult: any = null;
        
        // Parse and evaluate all top-level expressions
        while (tokens.length > 0) {
            const ast = this.parse(tokens);
            lastResult = this.evalAST(ast);
        }
        
        return lastResult;
    }

    /**
     * Tokenize Lisp code
     */
    private tokenize(code: string): string[] {
        const tokens: string[] = [];
        let current = '';
        let inString = false;
        let inComment = false;

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const nextChar = code[i + 1];

            if (inComment) {
                if (char === '\n') {
                    inComment = false;
                }
                continue;
            }

            if (char === ';' && !inString) {
                inComment = true;
                continue;
            }

            if (char === '"') {
                inString = !inString;
                current += char;
                continue;
            }

            if (inString) {
                current += char;
                continue;
            }

            if (char === '(' || char === ')') {
                if (current.trim()) {
                    tokens.push(current.trim());
                    current = '';
                }
                tokens.push(char);
            } else if (char === ' ' || char === '\n' || char === '\t') {
                if (current.trim()) {
                    tokens.push(current.trim());
                    current = '';
                }
            } else {
                current += char;
            }
        }

        if (current.trim()) {
            tokens.push(current.trim());
        }

        return tokens;
    }

    /**
     * Parse tokens into AST
     */
    private parse(tokens: string[]): any {
        if (tokens.length === 0) {
            throw new Error('Unexpected end of input');
        }

        const token = tokens.shift()!;

        if (token === '(') {
            const list: any[] = [];
            while (tokens.length > 0 && tokens[0] !== ')') {
                list.push(this.parse(tokens));
            }
            if (tokens.length === 0) {
                throw new Error('Unmatched opening parenthesis');
            }
            tokens.shift(); // Remove ')'
            return list;
        } else if (token === ')') {
            throw new Error('Unexpected closing parenthesis');
        } else {
            return this.atom(token);
        }
    }

    /**
     * Convert token to atom (number, string, or symbol)
     */
    private atom(token: string): any {
        // String
        if (token.startsWith('"') && token.endsWith('"')) {
            return token.slice(1, -1);
        }
        
        // Number
        const num = Number(token);
        if (!isNaN(num) && token.trim() !== '') {
            return num;
        }
        
        // Boolean
        if (token === 't' || token === 'true') {
            return true;
        }
        if (token === 'nil' || token === 'false') {
            return false;
        }
        
        // Symbol
        return token;
    }

    /**
     * Evaluate AST node
     */
    private evalAST(ast: any): any {
        // Handle atoms
        if (!Array.isArray(ast)) {
            if (typeof ast === 'number' || typeof ast === 'boolean') {
                return ast;
            }
            if (typeof ast === 'string') {
                // Symbol lookup first (symbols are stored as strings)
                if (this.environment.has(ast)) {
                    return this.environment.get(ast);
                }
                // If not a symbol, it's a string literal
                return ast;
            }
            // For other types, try symbol lookup
            if (this.environment.has(ast)) {
                return this.environment.get(ast);
            }
            throw new Error(`Undefined symbol: ${ast}`);
        }

        // Handle empty list
        if (ast.length === 0) {
            return [];
        }

        const [first, ...rest] = ast;

        // Special forms
        if (first === 'quote') {
            return rest[0];
        }

        if (first === 'setq' || first === 'set') {
            const [symbol, value] = rest;
            const evaluatedValue = this.evalAST(value);
            this.environment.set(symbol, evaluatedValue);
            return evaluatedValue;
        }

        if (first === 'defun') {
            const [name, params, ...body] = rest;
            const func = (...args: any[]) => {
                const oldEnv = new Map(this.environment);
                if (Array.isArray(params)) {
                    params.forEach((param: string, index: number) => {
                        this.environment.set(param, args[index]);
                    });
                }
                let result: any;
                body.forEach((expr: any) => {
                    result = this.evalAST(expr);
                });
                this.environment = oldEnv;
                return result;
            };
            // Store function in environment
            this.environment.set(name, func);
            return func;
        }
        
        if (first === 'lambda') {
            const [params, ...body] = rest;
            return (...args: any[]) => {
                const oldEnv = new Map(this.environment);
                if (Array.isArray(params)) {
                    params.forEach((param: string, index: number) => {
                        this.environment.set(param, args[index]);
                    });
                }
                let result: any;
                body.forEach((expr: any) => {
                    result = this.evalAST(expr);
                });
                this.environment = oldEnv;
                return result;
            };
        }

        if (first === 'let') {
            const [bindings, ...body] = rest;
            const oldEnv = new Map(this.environment);
            if (Array.isArray(bindings)) {
                // Handle let bindings: ((var1 val1) (var2 val2))
                bindings.forEach((binding: any) => {
                    if (Array.isArray(binding) && binding.length >= 2) {
                        const symbol = binding[0];
                        const value = this.evalAST(binding[1]);
                        this.environment.set(symbol, value);
                    }
                });
            }
            let result: any;
            body.forEach((expr: any) => {
                result = this.evalAST(expr);
            });
            this.environment = oldEnv;
            return result;
        }

        // Function call
        // First check if it's a built-in function
        let func: any = null;
        if (typeof first === 'string' && this.functions.has(first)) {
            func = this.functions.get(first);
        } else {
            // Otherwise, evaluate first (which might be a symbol in environment)
            func = this.evalAST(first);
        }
        
        if (typeof func !== 'function') {
            throw new Error(`${first} is not a function`);
        }

        const args = rest.map(arg => this.evalAST(arg));
        return func(...args);
    }

    /**
     * Register a custom function
     */
    registerFunction(name: string, func: Function) {
        this.functions.set(name, func);
    }

    /**
     * Set a variable in the environment
     */
    setVariable(name: string, value: any) {
        this.environment.set(name, value);
    }

    /**
     * Get a variable from the environment
     */
    getVariable(name: string): any {
        return this.environment.get(name);
    }
}

