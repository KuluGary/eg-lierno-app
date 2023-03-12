import { getInitials } from "@lierno/core-helpers";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Avatar } from "components/Avatar/Avatar";
import { Link } from "components/Link/Link";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import style from "./UserActions.style";

export default function UserActions({ isMainScreen = false }) {
  const { data: session, status: sessionStatus } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: "/" });
  };

  if (sessionStatus === "loading") return <React.Fragment />;

  if (sessionStatus === "unauthenticated")
    return (
      <Link
        href={"/api/auth/signing"}
        sx={style.unAuthLink}
        onClick={(e) => {
          e.preventDefault();
          signIn();
        }}
      >
        <Button variant="outlined" color={!isMainScreen ? "primary" : "inherit"}>
          Entrar
        </Button>
      </Link>
    );

  return (
    <>
      {isMainScreen && (
        <Link href="/characters" sx={style.goToAppLink}>
          Ir al Panel
        </Link>
      )}
      <IconButton onClick={handleMenu} color="inherit">
        <Avatar src={session?.picture} fallBackText={getInitials(session?.name)} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={!!anchorEl}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <Link href={"/account"}>Mi cuenta</Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Link href={`/api/auth/signout`}>Salir</Link>
        </MenuItem>
      </Menu>
    </>
  );
}
