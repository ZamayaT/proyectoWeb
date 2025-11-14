import {Box,Stack, Button, Modal, TextField, FormControlLabel, Checkbox} from "@mui/material"
import type { Ramo } from "../Types/Types"
import { useState } from "react"
import ramosServices from "../services/courses"

interface propModalAdmin {
    course : Ramo | null,
    openModal : boolean,
    setCourseSelected : () => void,
    setCourses : (course : Ramo) => void,
    closedModal : () => void, 
}

const ModalAdmin = (props : propModalAdmin) => {
    const {course, openModal, setCourses, closedModal} = props

    const [newName, setNewName] = useState(course?.name);
    const [newCode, setNewCode] = useState(course?.code);
    const [isRequired, setIsRequired] = useState(course?.required);

    const updateCourse = async () => {
        try {
            if(!course || !newCode || !newName || isRequired === undefined) return 

            const newCourse : Ramo = {
                ...course,
                name : newName,
                code : newCode,
                required : isRequired
            }

            const updatedCourse = await ramosServices.updateCourse(course.id, newCourse);
            // refrescar lista
            setCourses(updatedCourse);
            closedModal()
            alert("Curso actualizado correctamente ✅}");

        } catch (error) {
            console.log("aquii??")
            console.error("Error al actualizar:", error);
        }
    }

    return (
        <Modal
            open={openModal}
            onClose={() => closedModal()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Stack spacing={2}>
                <TextField label="Nombre" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth/>
                <TextField label="Código" value={newCode} onChange={(e) => setNewCode(e.target.value)} fullWidth/>

                <FormControlLabel
                    control={ <Checkbox checked={isRequired} onChange={() => setIsRequired(!isRequired)} /> }
                    label="Obligatorio"
                />

                <Button variant="contained" onClick={() => updateCourse()}> Actualizar </Button>
                </Stack>
            
            </Box>
        </Modal>
    )
}

export default ModalAdmin