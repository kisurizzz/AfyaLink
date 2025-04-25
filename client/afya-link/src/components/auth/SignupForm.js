import { TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const StyledSubmit = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

export default function SignupForm({ onSubmit, loading }) {
  return (
    <StyledForm onSubmit={onSubmit}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="signup-username"
        label="Username"
        name="signup-username"
        autoComplete="username"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="signup-password"
        label="Password"
        type="password"
        id="signup-password"
        autoComplete="new-password"
      />
      <StyledSubmit
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </StyledSubmit>
    </StyledForm>
  );
}
