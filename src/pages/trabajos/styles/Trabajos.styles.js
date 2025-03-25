import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  &:read-only {
    background-color: #f5f5f5;
  }
`;

export const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
`;

export const TableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 500;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FilterLabel = styled.label`
  font-weight: 500;
  color: #2c3e50;
`;

export const AutocompleteContainer = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const Select = styled.select`
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #3498db;
  }

  option {
    padding: 5px;
  }
`;

export const ExcelContainer = styled.div`
  margin-top: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: auto;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 500px;
`;

export const ExcelRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e0e0e0;
  min-width: 800px;
  &:last-child {
    border-bottom: none;
  }
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const ExcelCell = styled.div`
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #333;
  border-right: 1px solid #e0e0e0;
  &:last-child {
    border-right: none;
  }
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 120px;
`;

export const ExcelHeader = styled(ExcelCell)`
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 2px solid #dee2e6;
`; 