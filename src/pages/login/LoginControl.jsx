import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { login } from "../../services/auth";

const DEFAULT_VALUES = { email: "chef@recipes.com", password: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
    const errors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) errors.email = "אימייל הוא שדה חובה";
    else if (!EMAIL_RE.test(trimmedEmail)) errors.email = "כתובת האימייל אינה תקינה";
    if (!password) errors.password = "סיסמא היא שדה חובה";
    else if (password.length < 6) errors.password = "הסיסמא חייבת להכיל לפחות 6 תווים";
    return errors;
}

export default function LoginControlled() {
    const navigate = useNavigate();
    const emailId = useId();
    const passwordId = useId();

    const [values, setValues] = useState(DEFAULT_VALUES);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        const next = { ...values, [name]: value };
        setValues(next);
        setFormError("");
        // אחרי ניסיון שליחה, השגיאות מתעדכנות תוך כדי תיקון
        if (submitted) setErrors(validate(next));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        const found = validate(values);
        setErrors(found);
        setFormError("");
        if (Object.keys(found).length > 0) return;

        const user = login({ email: values.email.trim(), password: values.password });
        if (!user) {
            setFormError("אימייל או סיסמא שגויים");
            return;
        }
        navigate("/recipes");
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>התחברות - טופס מבוקר</h2>

            <div>
                <label htmlFor={emailId}>אימייל</label>
                <input
                    id={emailId}
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${emailId}-error` : undefined}
                />
                {errors.email && <p id={`${emailId}-error`} role="alert">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor={passwordId}>סיסמא</label>
                <input
                    id={passwordId}
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? `${passwordId}-error` : undefined}
                />
                {errors.password && <p id={`${passwordId}-error`} role="alert">{errors.password}</p>}
            </div>

            {formError && <p role="alert">{formError}</p>}

            <button type="submit">כניסה</button>
        </form>
    );
}