export const mlPhasesData = [
  {
    id: 1,
    title: "Phase 1: Foundation",
    subtitle: "Math & Python for ML",
    description: "Build core skills in Linear Algebra, Calculus, Probability, and Python data structures (NumPy, Pandas, Matplotlib).",
    milestone: "GitHub profile containing EDA notebook on clean dataset",
    resources: [
      {
        id: "ml-r101",
        title: "Essence of Linear Algebra by 3Blue1Brown",
        type: "video",
        provider: "YouTube (3Blue1Brown)",
        link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
        notes: "Crucial for understanding matrices, vectors, eigenvalues, and eigenvectors in ML."
      },
      {
        id: "ml-r102",
        title: "Pandas & NumPy Basics by Keith Galli",
        type: "video",
        provider: "YouTube",
        link: "https://www.youtube.com/watch?v=vmEHCJof1kU",
        notes: "Learn data ingestion, filtering, grouping, merging, and basic operations."
      },
      {
        id: "ml-r103",
        title: "Computational Linear Algebra",
        type: "course",
        provider: "fast.ai",
        link: "https://github.com/fastai/numerical-linear-algebra",
        notes: "Numerical computation focus using Python. Excellent for ML practitioners."
      },
      {
        id: "ml-r104",
        title: "CS229 Probability & Statistics Notes",
        type: "reading",
        provider: "Stanford",
        link: "https://cs229.stanford.edu/section/cs229-prob.pdf",
        notes: "PDF covering probability densities, expectations, variances, and distributions."
      }
    ]
  },
  {
    id: 2,
    title: "Phase 2: Classical ML",
    subtitle: "Core Algorithms & Scikit-Learn",
    description: "Master supervised and unsupervised models (Linear/Logistic Regression, SVMs, Decision Trees, KNN, Random Forests, K-Means).",
    milestone: "Submit first classical model to a Kaggle Competition",
    resources: [
      {
        id: "ml-r201",
        title: "Machine Learning Specialization by Andrew Ng",
        type: "course",
        provider: "Coursera / Stanford",
        link: "https://www.coursera.org/specializations/machine-learning-introduction",
        notes: "The gold standard introduction. Covers linear regression, classification, regularization."
      },
      {
        id: "ml-r202",
        title: "StatQuest Machine Learning playlist",
        type: "video",
        provider: "YouTube (StatQuest)",
        link: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
        notes: "Intuitive visual breakdowns of Decision Trees, Random Forests, SVMs, and PCA."
      },
      {
        id: "ml-r203",
        title: "Kaggle Learn: Intro to Machine Learning",
        type: "interactive",
        provider: "Kaggle",
        link: "https://www.kaggle.com/learn/intro-to-machine-learning",
        notes: "Hands-on tutorials in Python building models using Scikit-Learn."
      }
    ]
  },
  {
    id: 3,
    title: "Phase 3: Deep Learning",
    subtitle: "Neural Networks & PyTorch",
    description: "Understand Feedforward Networks, CNNs, RNNs, Transformers, and training tricks (regularization, optimizers, learning rates).",
    milestone: "Train a CNN on MNIST and deploy on HuggingFace Spaces",
    resources: [
      {
        id: "ml-r301",
        title: "Neural Networks: Zero to Hero by Andrej Karpathy",
        type: "video",
        provider: "YouTube",
        link: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUbFy1A",
        notes: "Build micrograd, GPT, and train models from scratch. Best explanation of backprop."
      },
      {
        id: "ml-r302",
        title: "Practical Deep Learning for Coders",
        type: "course",
        provider: "fast.ai",
        link: "https://course.fast.ai/",
        notes: "Top-down approach. Train advanced CNNs and Transformers in the first week."
      },
      {
        id: "ml-r303",
        title: "Dive into Deep Learning (D2L.ai)",
        type: "reading",
        provider: "D2L Book",
        link: "https://d2l.ai/",
        notes: "Comprehensive textbook with interactive multi-framework code blocks."
      }
    ]
  },
  {
    id: 4,
    title: "Phase 4: Specialization & MLOps",
    subtitle: "NLP, CV, and LLM Applications",
    description: "Learn LangChain/LlamaIndex, model fine-tuning (LoRA), FastAPI, Docker, and MLflow for experiment tracking.",
    milestone: "Build a RAG chatbot over custom PDFs and containerize it",
    resources: [
      {
        id: "ml-r401",
        title: "Hugging Face NLP Course",
        type: "course",
        provider: "Hugging Face",
        link: "https://huggingface.co/learn/nlp-course",
        notes: "Covers model libraries, datasets, tokenizers, pipelines, and training API."
      },
      {
        id: "ml-r402",
        title: "MLOps Zoomcamp by DataTalksClub",
        type: "course",
        provider: "DataTalks.Club",
        link: "https://github.com/DataTalksClub/mlops-zoomcamp",
        notes: "Free engineering course covering tracking, pipelines, deployment, and monitoring."
      },
      {
        id: "ml-r403",
        title: "LangChain Chatbot Course",
        type: "video",
        provider: "YouTube (Sam Witteveen)",
        link: "https://www.youtube.com/@samwitteveen",
        notes: "Excellent walkthroughs of Vector Databases (FAISS, Chroma), RAG pipelines, and Agents."
      }
    ]
  },
  {
    id: 5,
    title: "Phase 5: AIML Placement Prep",
    subtitle: "Interviews, System Design & Case Studies",
    description: "Prepare for ML engineering, Data Science, and AI developer roles at Top Tech firms.",
    milestone: "Complete 3 mock ML System Design interviews",
    resources: [
      {
        id: "ml-r501",
        title: "Machine Learning System Design playlist",
        type: "video",
        provider: "YouTube (Exponent)",
        link: "https://www.youtube.com/playlist?list=PL71H6_M_qX4j2g0E6mY4c0PebKj0H02Yx",
        notes: "Learn how to approach search recommendation engines, ad prediction, and self-driving systems."
      },
      {
        id: "ml-r502",
        title: "ML Engineering Interview Prep Guide",
        type: "reading",
        provider: "Chip Huyen",
        link: "https://huyenchip.com/ml-interviews-book/",
        notes: "Comprehensive overview of what to expect in engineering interviews."
      }
    ]
  }
];

export const mlInterviewQA = [
  {
    question: "What is the difference between L1 and L2 regularization?",
    answer: "L1 (Lasso) regularization adds the absolute values of the weights to the loss function. This pushes some weights to exactly zero, resulting in sparse feature selections. L2 (Ridge) regularization adds the squared magnitudes of the weights, which prevents weights from getting too large but keeps them non-zero."
  },
  {
    question: "Explain Bias-Variance Tradeoff.",
    answer: "Bias is the error introduced by simplifying assumptions made by a model (leads to underfitting). Variance is the error introduced due to the model's sensitivity to small fluctuations in the training set (leads to overfitting). As model complexity increases, bias decreases but variance increases."
  },
  {
    question: "How does the XGBoost algorithm work?",
    answer: "XGBoost stands for eXtreme Gradient Boosting. It is a decision-tree-based ensemble ML algorithm that uses a gradient boosting framework. Unlike Random Forest which builds trees in parallel, XGBoost builds trees sequentially. Each new tree corrects the errors (residuals) of the combined ensemble before it."
  },
  {
    question: "What is the vanishing gradient problem and how do we resolve it?",
    answer: "In deep neural networks, gradients are backpropagated through layers by multiplication. In very deep networks using activation functions like Sigmoid or Tanh, the gradients decay exponentially towards zero. We resolve this by using ReLU/GELU activations, Residual Connections (ResNet), and Batch Normalization."
  },
  {
    question: "How does Retrieval-Augmented Generation (RAG) work in LLMs?",
    answer: "RAG combines LLM generation with retrieval. When a user asks a query: (1) The query is embedded using an embedding model. (2) Similar document chunks are retrieved from a Vector Database. (3) The retrieved chunks are stuffed into the LLM's prompt context. (4) The LLM generates an accurate response based on the external data."
  },
  {
    question: "What is the difference between Bagging and Boosting?",
    answer: "Bagging (Bootstrap Aggregating) trains multiple independent models in parallel on random subsets of data (with replacement) and averages their predictions (e.g., Random Forest). Boosting trains models sequentially, where each new model is trained to fit the residuals/errors of the previous models (e.g., AdaBoost, XGBoost)."
  },
  {
    question: "How do you handle highly imbalanced datasets?",
    answer: "Strategies include: (1) Choosing appropriate metrics: Precision, Recall, F1-Score, ROC-AUC instead of Accuracy. (2) Resampling techniques: Oversampling the minority class (SMOTE), Undersampling the majority class. (3) Cost-sensitive learning: Adding class weights to penalize minority misclassifications. (4) Ensemble methods: Balanced Random Forest."
  }
];
