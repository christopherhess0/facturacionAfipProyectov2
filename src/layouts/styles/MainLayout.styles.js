import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const MainContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const Navbar = styled.nav`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  animation: ${slideIn} 0.5s ease-out;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  50% { border-color: transparent }
`;

export const UserName = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Poppins', 'Segoe UI', 'Roboto', sans-serif;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  display: inline-block;
  padding-right: 8px;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 2px;
    background-color: rgba(255, 255, 255, 0.7);
    animation: ${blink} 0.7s infinite;
  }

  animation: ${typing} 1s steps(20, end);
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

export const NavLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const Content = styled.main`
  padding: 80px 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
`; 