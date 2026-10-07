import ast


def analyze_python_code(code: str):
    """
    Analyze Python code for syntax errors
    and basic code-quality issues.
    """

    errors = []
    warnings = []

    # -----------------------------
    # Empty Code Check
    # -----------------------------

    if not code.strip():
        return {
            "status": "error",
            "message": "No code provided",
            "errors": [],
            "warnings": []
        }

    # -----------------------------
    # Syntax Analysis
    # -----------------------------

    try:
        tree = ast.parse(code)

    except SyntaxError as error:
        errors.append({
            "type": "SyntaxError",
            "message": error.msg,
            "line": error.lineno,
            "column": error.offset
        })

        return {
            "status": "error",
            "message": "Syntax error detected",
            "errors": errors,
            "warnings": []
        }

    # -----------------------------
    # Code Quality Analysis
    # -----------------------------

    for node in ast.walk(tree):

        # Detect functions containing only pass
        if isinstance(node, ast.FunctionDef):

            if len(node.body) == 1 and isinstance(node.body[0], ast.Pass):
                warnings.append({
                    "type": "CodeQuality",
                    "message": f"Function '{node.name}' contains only 'pass'.",
                    "line": node.lineno,
                    "suggestion": "Add an implementation or remove the unused function."
                })

        # Detect unused pass statements
        if isinstance(node, ast.Pass):

            warnings.append({
                "type": "CodeQuality",
                "message": "The code contains a 'pass' statement.",
                "line": node.lineno,
                "suggestion": "Replace 'pass' with actual logic when needed."
            })

    # -----------------------------
    # Final Result
    # -----------------------------

    if warnings:
        return {
            "status": "success",
            "message": "Code analyzed successfully",
            "errors": [],
            "warnings": warnings
        }

    return {
        "status": "success",
        "message": "No syntax errors or basic quality issues found",
        "errors": [],
        "warnings": []
    }