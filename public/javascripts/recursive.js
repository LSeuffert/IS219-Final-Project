function fib(months) {
    if (months < 3) {
	return 1;
    }
    return fib(months - 2) + fib(months - 1);
}

function pow(base, exponent) {
    if (exponent == 0) {
	return 1;
    }
    return base*pow(base, exponent-1);
}
