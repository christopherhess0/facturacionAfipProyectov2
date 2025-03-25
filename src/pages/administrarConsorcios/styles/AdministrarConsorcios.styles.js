import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
`;

export const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
`;

export const FilterSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FilterLabel = styled.label`
  color: #666;
  font-weight: 500;
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

export const Form = styled.form`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

export const InputGroup = styled.div`
  flex: 1;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

export const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-end;

  &:hover {
    background-color: #357abd;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const Th = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
`;

export const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #333;
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;

  &.edit {
    background-color: #ffc107;
    color: #000;

    &:hover {
      background-color: #e0a800;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }
`; 