import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { api } from '../config/api';

export const TablaTrabajos = () => {
    const [trabajos, setTrabajos] = useState([]);
    const [trabajosSeleccionados, setTrabajosSeleccionados] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // Cargar trabajos
    const cargarTrabajos = async () => {
        try {
            const data = await api.getAllTrabajos();
            setTrabajos(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los trabajos',
                status: 'error',
                duration: 3000,
            });
        }
    };

    useEffect(() => {
        cargarTrabajos();
    }, []);

    // Manejar selección de trabajos
    const toggleSeleccion = (trabajoId) => {
        setTrabajosSeleccionados(prev => 
            prev.includes(trabajoId)
                ? prev.filter(id => id !== trabajoId)
                : [...prev, trabajoId]
        );
    };

    // Facturar trabajos seleccionados
    const facturarSeleccionados = async () => {
        try {
            const trabajosAFacturar = trabajos.filter(t => 
                trabajosSeleccionados.includes(t._id)
            );

            if (trabajosAFacturar.length === 0) {
                toast({
                    title: 'Error',
                    description: 'Selecciona al menos un trabajo para facturar',
                    status: 'warning',
                    duration: 3000,
                });
                return;
            }

            const primerTrabajo = trabajosAFacturar[0];
            await api.facturarTrabajos({
                trabajosIds: trabajosSeleccionados,
                cuitCliente: primerTrabajo.cuitCliente,
                razonSocial: primerTrabajo.administracion.nombre
            });

            toast({
                title: 'Éxito',
                description: 'Trabajos facturados correctamente',
                status: 'success',
                duration: 3000,
            });

            cargarTrabajos();
            setTrabajosSeleccionados([]);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error al facturar los trabajos',
                status: 'error',
                duration: 3000,
            });
        }
    };

    // Exportar a Excel
    const exportarExcel = async () => {
        try {
            await api.exportarAExcel();
            toast({
                title: 'Éxito',
                description: 'Archivo Excel descargado correctamente',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error al exportar a Excel',
                status: 'error',
                duration: 3000,
            });
        }
    };

    // Exportar a Google Sheets
    const exportarGoogleSheets = async () => {
        try {
            await api.exportarAGoogleSheets(fechaInicio, fechaFin);
            toast({
                title: 'Éxito',
                description: 'Datos exportados a Google Sheets correctamente',
                status: 'success',
                duration: 3000,
            });
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error al exportar a Google Sheets',
                status: 'error',
                duration: 3000,
            });
        }
    };

    return (
        <Box>
            <Flex justify="space-between" mb={4}>
                <Button colorScheme="blue" onClick={facturarSeleccionados}>
                    Facturar Seleccionados
                </Button>
                <Box>
                    <Button colorScheme="green" onClick={exportarExcel} mr={2}>
                        Exportar a Excel
                    </Button>
                    <Button colorScheme="teal" onClick={onOpen}>
                        Exportar a Google Sheets
                    </Button>
                </Box>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Fecha</Th>
                        <Th>CUIT</Th>
                        <Th>Tipo de Trabajo</Th>
                        <Th>Ubicación</Th>
                        <Th>Importe</Th>
                        <Th>Administración</Th>
                        <Th>Estado</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {trabajos.map((trabajo) => (
                        <Tr key={trabajo._id}>
                            <Td>
                                <Checkbox
                                    isChecked={trabajosSeleccionados.includes(trabajo._id)}
                                    onChange={() => toggleSeleccion(trabajo._id)}
                                    isDisabled={trabajo.facturado}
                                />
                            </Td>
                            <Td>{new Date(trabajo.fecha).toLocaleDateString()}</Td>
                            <Td>{trabajo.cuitCliente}</Td>
                            <Td>{trabajo.tipoTrabajo}</Td>
                            <Td>{`${trabajo.ubicacion.departamento}/${trabajo.ubicacion.piso}`}</Td>
                            <Td>${trabajo.importe}</Td>
                            <Td>{trabajo.administracion.nombre}</Td>
                            <Td>{trabajo.facturado ? 'Facturado' : 'Pendiente'}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Exportar a Google Sheets</ModalHeader>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Fecha Inicio</FormLabel>
                            <Input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Fecha Fin</FormLabel>
                            <Input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={exportarGoogleSheets}>
                            Exportar
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}; 