import type { Service } from "@types/domain"
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Fade,
} from '@mui/material';

interface ServicesListProps {
  title?: string;
  services: Service[];
  onSelectService?: (id: number) => void;
}

export const ServicesList = ({ services, onSelectService }: ServicesListProps) => {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Box>
      <Box>
        {services.map((service, index) => (
          <Fade in={true} timeout={600 + (index * 200)} key={service.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom color="primary" fontWeight="bold">
                  {service.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" >
                  Servicio profesional de barbería con la mejor calidad y atención personalizada.
                </Typography>

                <Box>
                  <Chip 
                    label={`${service.durationMin} min`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Typography variant="h6" color="secondary" fontWeight="bold">
                    {formatPrice(service.price)}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => onSelectService?.(service.id)}
                  >
                  Reservar Ahora
                </Button>
              </CardActions>
            </Card>
          </Fade>
        ))}
      </Box>

      {services.length === 0 && (
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay servicios disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estamos trabajando para ofrecerte los mejores servicios.
          </Typography>
        </Box>
      )}
    </Box>
  );
};