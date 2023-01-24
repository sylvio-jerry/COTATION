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
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import StackedLineChartOutlinedIcon from '@mui/icons-material/StackedLineChartOutlined';

//accueil , vehicule /
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
          name: 'vehicule',
          icon: <DirectionsCarFilledOutlinedIcon />,
          path: 'vehicule'
        },
        {
          name: 'estimation du prix',
          icon: <LocalOfferOutlinedIcon />,
          path: 'tarif_de_manutention'
        },
        {
          name: 'utilisateur',
          icon: <SensorOccupiedOutlinedIcon />,
          path: 'utilisateur',
        },
      ],
    },
    {
      title: 'DIAGRAMMES',
      links: [
        {
          name: 'circulaire',
          icon: <DonutLargeOutlinedIcon />,
          path: 'circulaire'
        },
        {
          name: 'schémas de ligne',
          icon: <StackedLineChartOutlinedIcon />,
          path: 'linechart'
        },
        {
          name: 'en baton',
          icon: <InsertChartOutlinedIcon />,
          path: 'baton'
        }
      ],
    }
  ];