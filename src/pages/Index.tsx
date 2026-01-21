import { ThemeProvider } from '@/contexts/ThemeContext';
import { BoletimEditor } from '@/components/boletim/BoletimEditor';

const Index = () => {
  return (
    <ThemeProvider>
      <BoletimEditor />
    </ThemeProvider>
  );
};

export default Index;
