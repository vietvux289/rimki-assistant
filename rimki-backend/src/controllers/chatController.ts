import { Request, Response } from 'express';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Simulate AI response (in production, integrate with OpenAI or similar)
    const responses = [
      "I understand you're asking about our security policy. Based on the uploaded documents, I can help you with that.",
      "That's a great question! According to our security policy document, the answer is that all employees must follow the company's confidentiality agreement.",
      "I'd be happy to help you with that. Could you provide more details about what specific aspect of the security policy you're referring to?",
      "Based on the uploaded documents, the policy states that all sensitive information must be handled according to our data protection guidelines."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    res.json({
      message: randomResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
