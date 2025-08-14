import google.generativeai as genai
            

class AIService:
    
    def __init__(self, api_key=None):
        self.api_key = api_key or  'AIzaSyCQBCYqeN8sAuknO5iS8SscrMlX3sgCLi8'
        
    def get_response(self, message: str) -> str:
        """
        Get response from Google Gemini API
        
        Note: This method would contain the actual Gemini API integration
        """
        try:
            
            # Configure the Gemini API
            genai.configure(api_key=self.api_key)
            
            # Create a generative model instance
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            # Generate the response
            response = model.generate_content(message)
            
            # Extract and return the text
            if response.text:
                return response.text
            return self._get_mock_response(message)
            
        except Exception as e:
            # Log the error in production
            print(f"Error calling Gemini API: {e}")
            return "I'm sorry, I'm having trouble processing your request right now. Please try again later."
    

# Global AI service instance
ai_service = AIService()
