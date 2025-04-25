import { TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const StyledSubmit = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

export default function LoginForm({ onSubmit, loading }) {
  return (
    <StyledForm onSubmit={onSubmit}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <StyledSubmit
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </StyledSubmit>
    </StyledForm>
  );
}
