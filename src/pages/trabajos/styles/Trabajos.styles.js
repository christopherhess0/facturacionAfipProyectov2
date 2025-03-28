import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  padding-left: 4rem;
  position: relative;
  overflow-x: hidden;
  max-width: 1400px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  color: #1a237e;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;

export const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  align-items: start;

  .submit-button {
    grid-column: 1 / -1;
    justify-self: end;
    min-width: 200px;
    height: 48px;
    background: linear-gradient(45deg, #1976d2, #2196f3);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(45deg, #1565c0, #1976d2);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
      transform: translateY(-1px);
    }
  }

  .MuiTextField-root, .MuiFormControl-root {
    width: 100%;

    .MuiOutlinedInput-root {
      background: #f8f9fa;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: #fff;
      }

      &.Mui-focused {
        background: #fff;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
      }
    }

    .MuiInputLabel-root {
      color: #546e7a;
      
      &.Mui-focused {
        color: #1976d2;
      }
    }
  }
`;

export const SectionTitle = styled.h3`
  color: #1a237e;
  margin: 2rem 0 1rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  grid-column: 1 / -1;
`;

export const FormSection = styled.div`
  position: relative;
  margin-bottom: 2rem;
  margin-left: 100px;
`;

export const SyncButton = styled.div`
  .MuiIconButton-root {
    color: #1976d2;
    padding: 8px;
    transition: all 0.3s ease;

    svg {
      font-size: 20px;
    }

    &:hover {
      background-color: rgba(25, 118, 210, 0.1);
      transform: rotate(180deg);
    }

    &:disabled {
      color: #90a4ae;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
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
  border-collapse: separate;
  border-spacing: 0;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
`;

export const TableRow = styled.tr`
  background-color: #f8fafc;
  
  &:hover {
    background-color: #f1f5f9;
  }

  &:nth-child(even) {
    background-color: #f1f5f9;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 400;
  letter-spacing: 0.01071em;
  line-height: 1.43;
  
  &:first-child {
    font-weight: 500;
  }
`;

export const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  background-color: #2C5282;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.01071em;
  line-height: 1.5rem;
  border-bottom: none;
  
  &.sortable {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background-color: #2d3748;
    }
    
    .sort-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }
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
  color: #2C5282;

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
  justify-content: space-between;

  .left-section {
    display: flex;
    align-items: center;
    gap: 20px;
  }
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
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  font-size: 0.875rem;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  cursor: pointer;
  outline: none;
  color: white;
  font-weight: 500;
  width: 80px;
  text-align: center;
  appearance: none;
  background-color: ${props => props.value === "SI" ? '#4CAF50' : '#f44336'};
  transition: background-color 0.3s ease;
  letter-spacing: 0.01071em;

  &:hover {
    opacity: 0.9;
  }

  option {
    background-color: white;
    color: #424242;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
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

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
`; 