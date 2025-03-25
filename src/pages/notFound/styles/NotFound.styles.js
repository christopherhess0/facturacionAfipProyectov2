import styled from 'styled-components';

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  text-align: center;
`;

export const NotFoundContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const NotFoundTitle = styled.h1`
  font-size: 120px;
  margin: 0;
  color: #2c3e50;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const NotFoundSubtitle = styled.h2`
  font-size: 24px;
  color: #34495e;
  margin: 20px 0;
`;

export const NotFoundText = styled.p`
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.6;
`;

export const HomeButton = styled.button`
  background: #3498db;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ErrorImage = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`; 