import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CommunicationModal from "./CommunicationModal";
import CommunicationCalendar from "./CommunicationCalendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css'
const UserDashboard = () => {
  const [username, setUsername] = useState("");
  const [communications, setCommunications] = useState([]);
  const [over, setOver] = useState([]);
  const [today, setToday] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState([]);
  const [selected, setSelected] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const handleCommunicationPerformed = () => {
    const selectedCompanies = rowSelectionModel.map((selectedId) => {
      const selectedRow = communications.find((row) => row._id === selectedId);
      return { name: selectedRow.company.name };
    });
  
    setSelectedCompanyId(selectedCompanies);
    setOpenModal(true);
  };
  

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const navigate = useNavigate();
  const handleLogCommunication = async (data) => {
    try {
      // Update local state
      data.company.forEach((el) => {
        setCommunications((prev) => [
          ...prev,
          {
            company: { name: el.name },
            date: data.date,
            type: { name: data.type },
            notes: data.notes,
          },
        ]);
      });
  
      // Prepare payload for backend
      const payload = data.company.map((el) => ({
        companyName: el.name,
        date: data.date,
        type: data.type,
        notes: data.notes,
      }));
  
      // Send data to backend
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/save-communication`,
        { communications: payload }
      );
    } catch (error) {
      console.error("Error saving communication data:", error);
    }
  };
  

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedName = localStorage.getItem("username");
        if (storedName) {
          setUsername(storedName);
        } else {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/user-info`
          );
          setUsername(response.data.username); // Adjust based on your API response
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const communicationsData = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/communications-user`
        );
        setCommunications(communicationsData.data);

        const notifications = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/notifications`
        );
        setOver(notifications.data.filter((n) => n.type === "overdue"));
        setToday(notifications.data.filter((n) => n.type === "due today"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const columns = [
    {
      field: "name",
      headerName: "Company Name",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.company.name}</Typography>
        </Box>
      ),
    },
    {
      field: "lastCommunications",
      headerName: "Last 5 Communications",
      width: 300,
      renderCell: (params) => (
        <Box>
          <Tooltip title={params.row.notes}>
            <Typography>{`${params.row.type.name} - ${new Date(
              params.row.date
            ).toLocaleDateString()}`}</Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "nextCommunication",
      headerName: "Next Scheduled Communication",
      width: 300,
      renderCell: (params) => {
        const nextDate = new Date(params.row.date);
        nextDate.setDate(nextDate.getDate() + 5);
        return <Typography>{nextDate.toLocaleDateString()}</Typography>;
      },
    },
  ];

  return (
    <Box
      p={3}
      sx={{
        background: "linear-gradient(135deg, #f0f4f8, #e7efff)",
        minHeight: "100vh",
        color: "#2c3e50",
      }}
    >
      <Box display="flex" justifyContent="flex-end" mb={2}>
  <Button
    onClick={handleLogout}
    sx={{
      background: "linear-gradient(90deg, #1fd1f9, #b621fe)",
      color: "white",
      borderRadius: "5px",
      padding: "0.5rem 1.5rem",
      fontWeight: "bold",
      fontSize: "16px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)",
        zIndex: -1,
        transition: "all 0.3s ease",
      },
      "&:hover": {
        boxShadow:
          "4px 4px 6px 0 rgba(255, 255, 255, 0.5), -4px -4px 6px 0 rgba(116, 125, 136, 0.2), inset -4px -4px 6px 0 rgba(255, 255, 255, 0.5), inset 4px 4px 6px 0 rgba(116, 125, 136, 0.3)",
      },
      "&:hover:after": {
        transform: "scale(2) rotate(180deg)",
      },
    }}
  >
    Logout
  </Button>
</Box>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Welcome back, {username || "User"}!
      </Typography>
      <Box mb={4}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/003/559/330/non_2x/abstract-background-with-gradient-blue-bubble-vector.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Overdue Communications {over.length}
                </Typography>
                {over.length ? (
                  over.map((o, idx) => (
                    <Typography key={idx} sx={{ fontWeight: "bold" }}>
                      {idx + 1}. {o.company.name} - {o.message}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ fontWeight: "bold" }}>
                    No overdue communications
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/003/559/330/non_2x/abstract-background-with-gradient-blue-bubble-vector.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Today's Communications {today.length }
                </Typography>
                {today.length ? (
                  today.map((t, idx) => (
                    <Typography key={idx} sx={{ fontWeight: "bold" }}>
                      {idx + 1}. {t.company.name} - {t.message}
                    </Typography>
                  ))
                ) : (
                  <Typography sx={{ fontWeight: "bold" }}>
                    No communications due today
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box mb={3}>
      <DataGrid
  rows={communications}
  getRowId={(row) => row._id || `${row.company?.name}-${row.date}-${row.type?.name}`}
  columns={columns}
  pageSize={5}
  checkboxSelection
  disableSelectionOnClick
  onRowSelectionModelChange={(newSelection) => {
    setRowSelectionModel(newSelection);
    setSelected(newSelection.length > 0);
  }}
  sx={{
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  }}
/>

      </Box>
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          onClick={() => setShowCalendar((prev) => !prev)}
          sx={{
            borderRadius: "30px",
            background: "linear-gradient(90deg, #8e44ad, #9b59b6)",
            color: "white",
            padding: "0.5rem 2rem",
            "&:hover": {
              background: "linear-gradient(90deg, #732d91, #8e44ad)",
            },
          }}
        >
          See Communication Calendar
        </Button>
      </Box>
      {showCalendar && (
        
        <Box mt={4}>
           <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleCommunicationPerformed();
            }}
            disabled={!selected}
          >
            Communication Performed
          </Button>
          <CommunicationCalendar communications={communications} />
        </Box>
      )}
       <CommunicationModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleLogCommunication}
            company={selectedCompanyId}
          />
    </Box>
  );
};

export default UserDashboard;
