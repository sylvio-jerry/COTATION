import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import KeyboardCommandKeyOutlinedIcon from '@mui/icons-material/KeyboardCommandKeyOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import SensorOccupiedOutlinedIcon from '@mui/icons-material/SensorOccupiedOutlined';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import ControlCameraOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export const links = [
    {
      title: 'ACCUEIL',
      links: [
        {
          name: 'accueil',
          icon: <WidgetsOutlinedIcon />,
          path: 'accueil'
        },
      ],
    },
  
    {
      title: 'Pages',
      links: [
        {
          name: 'contrat de maintenance',
          icon: <HandshakeOutlinedIcon />,
          path: 'contrat_de_maintenance'
        },
        {
          name: 'contrat de garantie',
          icon: <DocumentScannerIcon />,
          path: 'contrat_de_garantie'
        },
        {
          name: 'maintenance GAB',
          icon: <ControlCameraOutlinedIcon />,
          path: 'contrat_de_maintenance_gab'
        },
        {
          name: 'garantie GAB',
          icon: <ViewInArIcon />,
          path: 'contrat_de_garantie_gab'
        },
        {
          name: 'livraison',
          icon: <ShoppingCartOutlinedIcon />,
          path: 'livraison'
        },
        {
          name: 'equipement',
          icon: <HubOutlinedIcon />,
          path: 'equipement',
        },
        {
          name: 'client',
          icon: <Diversity3Icon />,
          path: 'client',
        },
        {
          name: 'ville',
          icon: <FmdGoodIcon />,
          path: 'ville',
        },
        {
          name: 'service',
          icon: <KeyboardCommandKeyOutlinedIcon />,
          path: 'service',
        },
        {
          name: 'famille',
          icon: <LanOutlinedIcon />,
          path: 'famille',
        },
        {
          name: 'utilisateur',
          icon: <SensorOccupiedOutlinedIcon />,
          path: 'utilisateur',
        },
      ],
    },
    {
      title: 'HISTOGRAMME',
      links: [
        {
          name: 'histogramme',
          icon: <InsertChartOutlinedIcon />,
          path: 'histogramme',
        }
      ],
    }
  ];