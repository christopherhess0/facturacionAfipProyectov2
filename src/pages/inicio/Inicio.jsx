import { motion } from 'framer-motion';
import React from 'react';
import {
  Container,
  FeatureCard,
  FeatureDescription,
  FeatureIcon,
  FeaturesGrid,
  FeatureTitle,
  GradientOverlay,
  HeroSection,
  StatCard,
  StatLabel,
  StatNumber,
  StatsContainer,
  Subtitle,
  Title,
  Wave,
  WaveContainer
} from './styles/Inicio.styles';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const features = [
  {
    icon: '🏢',
    title: 'Gestión de Edificios',
    description: 'Administra fácilmente todos los edificios y consorcios con una interfaz intuitiva.'
  },
  {
    icon: '🔧',
    title: 'Trabajos de Destapación',
    description: 'Registra y hace seguimiento de todos los trabajos de destapación realizados.'
  },
  {
    icon: '📊',
    title: 'Control de Facturación',
    description: 'Mantén un registro detallado de los trabajos facturados y pendientes.'
  },
  {
    icon: '📱',
    title: 'Diseño Responsivo',
    description: 'Accede a la plataforma desde cualquier dispositivo con una experiencia optimizada.'
  }
];

const stats = [
  { number: '100+', label: 'Edificios' },
  { number: '500+', label: 'Trabajos Realizados' },
  { number: '50+', label: 'Administradores' },
  { number: '99%', label: 'Satisfacción' }
];

const Inicio = () => {
  return (
    <Container>
      <GradientOverlay />
      <HeroSection
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Title>Sistema de Gestión de Destapaciones</Title>
          <Subtitle>
            Gestiona y controla todos tus trabajos de destapación con nuestra plataforma 😍
          </Subtitle>
        </motion.div>

        <WaveContainer>
          <Wave
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              as={motion.path}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="#3498db"
              fillOpacity="0.2"
            />
          </Wave>
        </WaveContainer>
      </HeroSection>

      <StatsContainer
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            as={motion.div}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsContainer>

      <FeaturesGrid
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            as={motion.div}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </Container>
  );
};

export default Inicio; 