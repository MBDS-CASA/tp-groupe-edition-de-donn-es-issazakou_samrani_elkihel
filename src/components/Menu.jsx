import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import NotesIcon from '@mui/icons-material/Notes';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import InfoIcon from '@mui/icons-material/Info';

const MENU_ITEMS = [
    { text: 'Notes', icon: <NotesIcon />, path: '/notes' },
    { text: 'Etudiants', icon: <PeopleIcon />, path: '/students' },
    { text: 'Matières', icon: <ClassIcon />, path: '/matieres' },
    { text: 'A propos', icon: <InfoIcon />, path: '/apropos' },
];

function Menu({ selected, onMenuClick }) {
    return (
        <AppBar position="static">
            <Toolbar>
                {MENU_ITEMS.map((item) => (
                    <Button
                        key={item.text}
                        color="inherit"
                        startIcon={item.icon}
                        component={Link}
                        to={item.path}
                        onClick={() => onMenuClick(item.text)}
                        sx={{ color: selected === item.text ? 'secondary.main' : 'inherit' }}
                    >
                        {item.text}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
}

export default Menu;