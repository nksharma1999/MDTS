export const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#4F7942', padding: "30px" }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          {/* <img src="https://simproglobal.com/wp-content/uploads/2015/10/slider_logo1.png" alt="" height="80px"/> */}
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
            style={{ marginTop: '0px', paddingTop: '0px' }}
          >
            <h5 className="mb-0" style={{ color: '#FFF', fontSize: '25px',marginTop: '0px', paddingTop: '0px' }}>
              Mine Development Tracking System (MDTS)
            </h5>
          </div>


          <div className="d-flex">
            {/* <div style={{ textAlign: "center" }}>
              <p>Powered by</p>
              <p>MineSense Pvt. Ltd.</p>
            </div> */}
            <img src="../public/image2.png" alt="" height="60px" />
          </div>
        </div>
      </div>
    </nav>
  );
};
