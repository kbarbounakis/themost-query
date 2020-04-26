import {MethodCallExpression} from './expressions';

class FallbackMethodParser {
    test(name) {
        const matches = /\.(\w+)$/.exec(name);
        if (matches == null) {
            return;
        }
        const method = matches[1];
        if (typeof FallbackMethodParser[method] === 'function') {
            return FallbackMethodParser[method];
        }
    }
    static count(args) {
        return new MethodCallExpression('count', args);
    }
    static round(args) {
        return new MethodCallExpression('round', args);
    }

    static floor(args) {
        return new MethodCallExpression('floor', args);
    }

    static ceil(args) {
        return new MethodCallExpression('ceil', args);
    }

    static mod(args) {
        return new MethodCallExpression('mod', args);
    }

    static add(args) {
        return new MethodCallExpression('add', args);
    }

    static subtract(args) {
        return new MethodCallExpression('subtract', args);
    }

    static multiply(args) {
        return new MethodCallExpression('multiply', args);
    }

    static divide(args) {
        return new MethodCallExpression('divide', args);
    }

    static bitAnd(args) {
        return new MethodCallExpression('bit', args);
    }
    static mean(args) {
        return new MethodCallExpression('avg', args);
    }
    static sum(args) {
        return new MethodCallExpression('sum', args);
    }
    static min(args) {
        return new MethodCallExpression('min', args);
    }
    static max(args) {
        return new MethodCallExpression('max', args);
    }
}

export {
    FallbackMethodParser
}