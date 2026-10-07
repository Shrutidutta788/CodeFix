import ast


def generate_fix(code: str, error_message: str, line_number: int | None = None):
    """
    Generate corrected code for common Python syntax errors.
    """

    lines = code.splitlines()

    # -----------------------------------------
    # Unterminated string literal
    # -----------------------------------------

    if "unterminated string literal" in error_message.lower():

        if line_number and 1 <= line_number <= len(lines):
            line = lines[line_number - 1]

            double_quotes = line.count('"')
            single_quotes = line.count("'")

            if double_quotes % 2 != 0:
                lines[line_number - 1] = line + '"'

            elif single_quotes % 2 != 0:
                lines[line_number - 1] = line + "'"

            else:
                return {
                    "suggestion": "A quotation mark is missing.",
                    "fixed_code": None
                }

            fixed_code = "\n".join(lines)

            return {
                "suggestion": "Missing quotation mark added.",
                "fixed_code": fixed_code
            }

    # -----------------------------------------
    # Missing closing bracket / parenthesis
    # -----------------------------------------

    if "was never closed" in error_message.lower():

        fixed_code = code

        opening_parentheses = code.count("(")
        closing_parentheses = code.count(")")

        opening_brackets = code.count("[")
        closing_brackets = code.count("]")

        opening_braces = code.count("{")
        closing_braces = code.count("}")

        if opening_parentheses > closing_parentheses:
            fixed_code += ")" * (
                opening_parentheses - closing_parentheses
            )

        if opening_brackets > closing_brackets:
            fixed_code += "]" * (
                opening_brackets - closing_brackets
            )

        if opening_braces > closing_braces:
            fixed_code += "}" * (
                opening_braces - closing_braces
            )

        if fixed_code != code:
            return {
                "suggestion": "Missing closing bracket was added.",
                "fixed_code": fixed_code
            }

    # -----------------------------------------
    # Invalid syntax
    # -----------------------------------------

    if "invalid syntax" in error_message.lower():

        return {
            "suggestion": "Please check the reported line for incorrect Python syntax.",
            "fixed_code": None
        }

    # -----------------------------------------
    # Default
    # -----------------------------------------

    return {
        "suggestion": "CodeFix could not automatically correct this issue yet.",
        "fixed_code": None
    }