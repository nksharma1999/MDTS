export const Header = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: '#4F7942',
        padding: "20px 20px", // Reduced top padding
      }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          {/* Logo can be added here */}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div
            className="d-flex justify-content-center align-items-center flex-grow-1"
            style={{
              marginTop: 0,
              paddingTop: 0,
            }}
          >
            <h5
              className="mb-0"
              style={{
                color: '#FFF',
                fontSize: '25px',
                margin: 0, // Removed margin for better alignment
              }}
            >
              Mine Development Tracking System (MDTS)
            </h5>
          </div>

          <div className="d-flex align-items-center">
            <img src="../public/image2.png" alt="" height="50px" />
          </div>
        </div>
      </div>
    </nav>
  );
};
