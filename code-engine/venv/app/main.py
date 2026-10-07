from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ast
import io
import tokenize


app = FastAPI(title="CodeFix API")


 # CORS
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

  # REQUEST MODEL
 
class CodeRequest(BaseModel):
    language: str
    code: str

  # CHECK PYTHON CODE
 
def check_python(code: str):
    try:
        ast.parse(code)
        return None

    except SyntaxError as error:
        return error


 # FIX UNTERMINATED STRING
 
def fix_unterminated_string(code: str):
    lines = code.splitlines()

    if not lines:
        return code

    fixed_lines = []

    for line in lines:

        stripped = line.rstrip()

        # Count quotes
        double_quotes = stripped.count('"')
        single_quotes = stripped.count("'")

    
        # Example:
        # print("hello
        # becomes:
        # print("hello")
 
        if double_quotes % 2 != 0:
            stripped += '"'

        elif single_quotes % 2 != 0:
            stripped += "'"

        fixed_lines.append(stripped)

    return "\n".join(fixed_lines)

  # FIX MISSING BRACKETS / PARENTHESES
 
def fix_missing_brackets(code: str):

    result = []
    stack = []

    pairs = {
        ")": "(",
        "]": "[",
        "}": "{"
    }

    opening = "([{"

    for char in code:

        result.append(char)

        if char in opening:
            stack.append(char)

        elif char in pairs:

            if stack and stack[-1] == pairs[char]:
                stack.pop()

    # Add missing closing brackets
    closing = {
        "(": ")",
        "[": "]",
        "{": "}"
    }

    while stack:
        opening_bracket = stack.pop()
        result.append(closing[opening_bracket])

    return "".join(result)

  # FIX COMMON MISSING COLON
 
def fix_missing_colon(code: str):

    lines = code.splitlines()
    fixed_lines = []

    keywords = (
        "if ",
        "elif ",
        "else",
        "for ",
        "while ",
        "def ",
        "class ",
        "try",
        "except",
        "finally",
        "with ",
    )

    for line in lines:

        stripped = line.strip()

        if not stripped:
            fixed_lines.append(line)
            continue

        should_have_colon = False

        for keyword in keywords:

            if stripped.startswith(keyword):
                should_have_colon = True
                break

        if should_have_colon:

            if not stripped.endswith(":"):
                line = line + ":"

        fixed_lines.append(line)

    return "\n".join(fixed_lines)


 # COMPLETE PYTHON AUTO FIX..
 
def generate_fixed_code(code: str):

    fixed = code

     # STEP 1: Fix unterminated strings
 
    fixed = fix_unterminated_string(fixed)

     # STEP 2: Fix missing brackets
 
    fixed = fix_missing_brackets(fixed)

     # STEP 3: Fix common missing colon
 
    fixed = fix_missing_colon(fixed)

     # STEP 4: Try parsing again
 
    error = check_python(fixed)

    if error is None:
        return fixed

    #  STEP 5: Try bracket fix one more time
 
    fixed = fix_missing_brackets(fixed)

    error = check_python(fixed)

    if error is None:
        return fixed

    #  STEP 6: If still invalid, return best generated code
 
    return fixed


#  ANALYZE PYTHON
 
def analyze_python(code: str):

    error = check_python(code)

    #  NO ERROR
 
    if error is None:

        return {
            "status": "success",
            "message": "Your Python code is correct and has no syntax errors.",
            "errors": [],
            "suggestion": "No syntax errors detected.",
            "fix": {
                "fixed_code": code
            }
        }

    #  ERROR FOUND
 
    error_info = {
        "type": type(error).__name__,
        "message": error.msg,
        "line": error.lineno,
        "column": error.offset
    }

    # Generate corrected code
    fixed_code = generate_fixed_code(code)

    # Check whether generated code is actually valid
    fixed_error = check_python(fixed_code)

    #  FIX SUCCESSFUL
 
    if fixed_error is None:

        return {
            "status": "error",
            "message": "CodeFix detected an error and generated corrected code.",
            "errors": [error_info],
            "suggestion": "Review the corrected code and click Apply Fix.",
            "fix": {
                "fixed_code": fixed_code
            }
        }

    #  FIX NOT POSSIBLE
 
    return {
        "status": "error",
        "message": "CodeFix detected a syntax error but could not safely fix it automatically.",
        "errors": [error_info],
        "suggestion": "Please review the error and modify the code.",
        "fix": {
            "fixed_code": fixed_code
        }
    }

#   ANALYZE API
 
@app.post("/analyze")
async def analyze_code(request: CodeRequest):

    if request.language.lower() != "python":

        return {
            "status": "error",
            "message": "CodeFix currently supports Python only.",
            "errors": [],
            "suggestion": "Please select Python.",
            "fix": {
                "fixed_code": request.code
            }
        }

    if not request.code.strip():

        return {
            "status": "error",
            "message": "Please enter Python code.",
            "errors": [],
            "suggestion": "Write or paste your Python code in the editor.",
            "fix": {
                "fixed_code": ""
            }
        }

    return analyze_python(request.code)


#  ROOT
 
@app.get("/")
async def root():

    return {
        "message": "CodeFix Backend is running 🚀",
        "language": "Python"
    }
 
#  RUN SERVER
 
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000
    )