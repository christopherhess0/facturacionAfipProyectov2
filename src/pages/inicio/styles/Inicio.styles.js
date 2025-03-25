import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

export const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(52, 152, 219, 0.1) 0%, transparent 70%);
  pointer-events: none;
`;

export const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  padding: 60px 20px;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #34495e;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const WaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
`;

export const Wave = styled.svg`
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 150px;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 0 20px;
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
`;

export const StatNumber = styled.h2`
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 10px;
  font-weight: 700;
`;

export const StatLabel = styled.p`
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
`;

export const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #34495e;
  line-height: 1.6;
  margin: 0;
`; 