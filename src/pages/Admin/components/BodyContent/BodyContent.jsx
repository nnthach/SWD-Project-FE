import Booking from '~/pages/Admin/components/BodyContent/Booking/Booking';
import Dashboard from '~/pages/Admin/components/BodyContent/Dashboard/Dashboard';
import Service from '~/pages/Admin/components/BodyContent/Service/Service';
import StaffConsultant from '~/pages/Admin/components/BodyContent/StaffConsultant/StaffConsultant';
import StaffSchedule from '~/pages/Admin/components/BodyContent/StaffSchedule/StaffSchedule';
import User from '~/pages/Admin/components/BodyContent/User/User';

function BodyContent({ contentRender }) {
  const handleRenderContent = () => {
    switch (contentRender) {
      case 'dashboard':
        return <Dashboard />;
      case 'user':
        return <User />;
      case 'service':
        return <Service />;
      case 'booking':
        return <Booking />;
      case 'staffschedule':
        return <StaffSchedule />;
      case 'staffconsultant':
        return <StaffConsultant />;
    }
  };
  return <>{handleRenderContent()}</>;
}

export default BodyContent;
