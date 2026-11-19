import { useId } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import { login } from "../../services/auth";
import { loginSchema } from "../../utils/schema";

export default function LoginRhf() {
    const navigate = useNavigate();
    const emailId = useId();
    const passwordId = useId();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: joiResolver(loginSchema),
        mode: "onTouched", // שגיאות מוצגות אחרי שנגעו בשדה, ואז מתעדכנות בזמן אמת
        defaultValues: { email: "chef@recipes.com", password: "" },
    });

    function onSubmit(data) {
        const user = login(data);
        if (!user) {
            setError("root", { message: "אימייל או סיסמא שגויים" });
            return;
        }
        navigate("/recipes");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2>התחברות - react-hook-form</h2>

            <div>
                <label htmlFor={emailId}>אימייל</label>
                <input
                    id={emailId}
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${emailId}-error` : undefined}
                />
                {errors.email && <p id={`${emailId}-error`} role="alert">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor={passwordId}>סיסמא</label>
                <input
                    id={passwordId}
                    type="password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? `${passwordId}-error` : undefined}
                />
                {errors.password && <p id={`${passwordId}-error`} role="alert">{errors.password.message}</p>}
            </div>

            {errors.root && <p role="alert">{errors.root.message}</p>}

            <button type="submit">כניסה</button>
        </form>
    );
}