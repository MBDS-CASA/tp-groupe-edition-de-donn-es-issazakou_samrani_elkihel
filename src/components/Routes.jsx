import { Route, Routes } from 'react-router';
import Notes from './Notes';
//import Etudiants from './Etudiants';
import Matieres from './Matieres.jsx';
import APropos from './APropos.jsx';
import StudentContainer from './Etudiants';
//import StudentDetail from './StudentDetail';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/notes" element={<Notes />} />
            <Route path="/students" element={<StudentContainer />} />
            <Route path="/matieres" element={<Matieres />} />
            <Route path="/apropos" element={<APropos />} />

        </Routes>
    );
}

export default AppRoutes;