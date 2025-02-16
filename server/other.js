
// Get Attendance Records (with filtering)
export const getAttendanceRecords = async (req, res) => {
    try {
        const { employeeId, status, startDate, endDate } = req.query;
        let filter = {};

        if (employeeId) filter.employeeId = employeeId;
        if (status) filter.status = status;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start) || isNaN(end)) {
                return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD." });
            }

            filter.date = { $gte: start, $lte: end };
        }

        const attendanceRecords = await Attendance.find(filter).populate("employeeId", "name email position status");

        res.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ message: "Server error. Unable to fetch attendance records.", error: error.message });
    }
};


// Get Attendance for a Specific Employee
export const getEmployeeAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid employee ID format." });
        }

        const attendanceRecords = await Attendance.find({ employeeId: id })
            .populate("employeeId", "name email position");

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this employee." });
        }

        res.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching employee attendance:", error);
        res.status(500).json({ message: "Server error. Unable to fetch attendance records.", error: error.message });
    }
};


// Delete Attendance Record
export const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid attendance ID format." });
        }

        const attendance = await Attendance.findById(id);
        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        await attendance.deleteOne();
        res.json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        console.error("Error deleting attendance record:", error);
        res.status(500).json({ message: "Server error. Unable to delete attendance record.", error: error.message });
    }
};


router.get("/", authMiddleware, getAttendanceRecords);
router.get("/:id", authMiddleware, getEmployeeAttendance);
router.delete("/:id", authMiddleware, deleteAttendance);



// Delete Leave Request
export const deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Leave request not found" });

        if (leave.documents) {
            try {
                await fs.promises.unlink(leave.documents);
            } catch (fileError) {
                console.error("Error deleting leave document:", fileError);
            }
        }

        await leave.deleteOne();
        res.json({ message: "Leave request deleted successfully" });
    } catch (error) {
        console.error("Error deleting leave request:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};