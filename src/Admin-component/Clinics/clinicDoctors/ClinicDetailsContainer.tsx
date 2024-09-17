import { useState, useEffect } from "react";
import { ClinicDetailsPresentation } from "./ClinicDetailsPresentation";
import { DoctorRevenueEntry } from "./DoctorRevenueEntry";
import { Clinic, DoctorWage } from "../ClinicsInterfaces";
import { useLocation } from "react-router-dom";

const ClinicDetailsContainer = () => {
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [doctors, setDoctors] = useState<DoctorWage[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<DoctorWage[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorWage | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const clinicValue = location?.state?.clinic?.value;
    const clinicLabel = location?.state?.clinic?.label;
    const AllDoctors = location?.state?.doctors;
    // const searchedDoctorName = location?.state?.searchedDoctorName;
    const searchedTerm = location?.state?.searchedTerm;

    useEffect(() => {
        setClinic({ value: clinicValue, label: clinicLabel });
    }, [clinicValue, clinicLabel]);

    useEffect(() => {
        if (clinic) {
            const filteredDocs = filterDoctorsAccordingToSpeciality();
            setDoctors(filteredDocs);
            setFilteredDoctors(filteredDocs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clinic]);

    useEffect(() => {
        if (searchedTerm) {
            setSearchTerm(searchedTerm);
            filterDoctors(searchedTerm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchedTerm, doctors]);

    const filterDoctorsAccordingToSpeciality = () => {
        return AllDoctors.filter(
            (doctor: DoctorWage) => doctor.specialty === clinic?.value
        );
    };

    const filterDoctors = (term: string) => {
        const filtered = doctors.filter(
            (doctor) =>
                doctor.name.toLowerCase().includes(term.toLowerCase()) ||
                (clinic &&
                    clinic.label.toLowerCase().includes(term.toLowerCase()))
        );
        setFilteredDoctors(filtered);
    };

    const handleSearchTermChange = (term: string) => {
        setSearchTerm(term);
        filterDoctors(term);
    };

    const handleDoctorSelect = (doctor: DoctorWage) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
    };

    const handleSaveRevenueData = (
        doctorId: number,
        totalRevenue: number,
        doctorShare: number,
        centerShare: number
    ) => {
        console.log(`حفظ بيانات الإيرادات للطبيب ${doctorId}:`, {
            totalRevenue,
            doctorShare,
            centerShare,
        });
        const updatedDoctors = doctors.map((doctor) =>
            doctor.id === doctorId
                ? { ...doctor, totalRevenue, doctorShare, centerShare }
                : doctor
        );
        setDoctors(updatedDoctors);
        setFilteredDoctors(updatedDoctors);
        handleCloseModal();
    };

    if (!clinic) {
        return <div>جاري التحميل...</div>;
    }

    return (
        <>
            <ClinicDetailsPresentation
                clinic={clinic}
                doctors={filteredDoctors}
                onDoctorSelect={handleDoctorSelect}
                searchTerm={searchTerm}
                setSearchTerm={handleSearchTermChange}
            />
            {selectedDoctor && (
                <DoctorRevenueEntry
                    doctor={selectedDoctor}
                    onSave={handleSaveRevenueData}
                    open={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default ClinicDetailsContainer;
