import { useActionState, useId } from "react";
import { useNavigate } from "react-router";
import { login } from "../../services/auth";

const DEFAULT_EMAIL = "chef@recipes.com";
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

/*
 * שאלה: האם ניתן לבדוק תקינות בעת הקלדה?
 * בטופס לא מבוקר אין state של הערכים, ולכן אין "מקור אמת" שמתעדכן בכל הקלדה.
 * אפשר לבדוק בזמן הקלדה רק בעזרת onBlur / onChange שקוראים את e.target.value
 * ושומרים את השגיאה ב-state נפרד, שזה למעשה חוזר לגישה המבוקרת.
 *
 * התשובה בפרויקט הזה: הבדיקה מתבצעת רק בשליחה, בתוך הפונקציה loginAction
 * (שמועברת ל-form action). אחרי השליחה השגיאות מוצגות דרך מצב ה-action.
 * בלי ה-state, לא ניתן לבדוק בכלל "בזמן אמת" בלי להוסיף לוגיקה נוספת.
 *
 * שדות הטופס: השדות לא נמחקים אחרי שליחה שנכשלה, כי React מאפס טופס
 * ל-defaultValue שלו אחרי כל action, ולכן defaultValue מתעדכן לערכים האחרונים
 * שהוקלדו (נשמרים ב-state של ה-action, לא בשדות בודדים).
 */
export default function LoginUncontrolled() {
    const navigate = useNavigate();
    const emailId = useId();
    const passwordId = useId();

    async function loginAction(_prevState, formData) {
        const values = Object.fromEntries(formData.entries());
        const errors = validate(values);

        if (Object.keys(errors).length > 0) {
            return { values, errors, formError: "" };
        }

        const user = login({ email: values.email.trim(), password: values.password });
        if (!user) {
            return { values, errors: {}, formError: "אימייל או סיסמא שגויים" };
        }

        navigate("/recipes");
        return { values, errors: {}, formError: "" };
    }

    const [state, formAction, isPending] = useActionState(loginAction, {
        values: { email: DEFAULT_EMAIL, password: "" },
        errors: {},
        formError: "",
    });

    return (
        <form action={formAction} noValidate>
            <h2>התחברות - טופס לא מבוקר</h2>

            <div>
                <label htmlFor={emailId}>אימייל</label>
                <input
                    id={emailId}
                    name="email"
                    type="email"
                    defaultValue={state.values.email}
                    aria-invalid={!!state.errors.email}
                    aria-describedby={state.errors.email ? `${emailId}-error` : undefined}
                />
                {state.errors.email && <p id={`${emailId}-error`} role="alert">{state.errors.email}</p>}
            </div>

            <div>
                <label htmlFor={passwordId}>סיסמא</label>
                <input
                    id={passwordId}
                    name="password"
                    type="password"
                    defaultValue={state.values.password}
                    aria-invalid={!!state.errors.password}
                    aria-describedby={state.errors.password ? `${passwordId}-error` : undefined}
                />
                {state.errors.password && <p id={`${passwordId}-error`} role="alert">{state.errors.password}</p>}
            </div>

            {state.formError && <p role="alert">{state.formError}</p>}

            <button type="submit" disabled={isPending}>כניסה</button>
        </form>
    );
}