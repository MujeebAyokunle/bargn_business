import React from 'react'

function CustomSwitch({ onToggle, isOn }: any) {
    return (
        <div
            className={`switch ${isOn ? "on" : "off"}`}
            onClick={() => onToggle(!isOn)}
            style={{
                width: "40px",
                height: "24px",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: `${isOn ? "flex-end" : "flex-start"}`,
                backgroundColor: isOn ? "#AF52DE" : "#d1d5db",
                padding: "3px",
                cursor: "pointer",
                transition: "0.3s all",
            }}
        >
            <div
                style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
            ></div>
        </div>
    )
}

export default CustomSwitch